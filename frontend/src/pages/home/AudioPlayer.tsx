import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../utils/db";
import { TDeviceContext, useMic } from "../settings/DeviceContext";
import { useRef, useState } from "react";

export function AudioPlayer() {
  const { remoteStream, peerConnection } = useMic() as TDeviceContext;
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [callId, setCallId] = useState<string>("");

  const handleStartCall = async () => {
    const callDoc = doc(collection(firestore, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");
    setCallId(callDoc.id);

    if (peerConnection.current && remoteStream.current) {
      peerConnection.current.ontrack = (event) => {
        remoteStream.current?.addTrack(event.track);

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject =
            remoteStream.current as MediaStream;
          remoteAudioRef.current.play();
        }
      };
    }

    if (peerConnection.current) {
      peerConnection.current.onicecandidate = (e) => {
        if (e.candidate) {
          addDoc(offerCandidates, e.candidate.toJSON());
        }
      };
    }

    const offerDesc = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offerDesc);

    const offer = {
      sdp: offerDesc?.sdp,
      type: offerDesc?.type,
    };
    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      if (data.answer && peerConnection.current) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.current.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  const handleAnswerCall = async (callId: string) => {
    const callDoc = doc(collection(firestore, "calls"), callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    if (peerConnection.current && remoteStream.current) {
      peerConnection.current.ontrack = (event) => {
        console.log(event.track.kind)
        remoteStream.current?.addTrack(event.track);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject =
            remoteStream.current as MediaStream;
          remoteAudioRef.current.play();
        }
      };
    }

    if (peerConnection.current) {
      peerConnection.current.onicecandidate = (e) => {
        if (e.candidate) {
          addDoc(answerCandidates, e.candidate.toJSON());
        }
      };
    }
    const callSnap = await getDoc(callDoc);
    const callData = callSnap.data();

    if (!callData?.offer || !callData.offer.type || !callData.offer.sdp) {
      console.error("Invalid offer in Firestore document:", callData?.offer);
      return;
    }

    const offerDescription = new RTCSessionDescription({
      type: callData.offer.type,
      sdp: callData.offer.sdp,
    });

    await peerConnection.current?.setRemoteDescription(offerDescription);

    const answerDescription = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription?.sdp,
      type: answerDescription?.type,
    };

    await setDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  const handleInput = (e) => {
    setCallId(e.target.value);
  };

  return (
    <div>
      <button onClick={() => handleStartCall()}>Start call</button>
      <button onClick={() => handleAnswerCall(callId)}>Answer call</button>
      <input type="text" value={callId} onChange={handleInput} />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
