import React, { useRef } from "react";
import { useEffect } from "react";

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  iceCandidatePoolSize: 10,
};
export interface TDeviceContext {
  localStream: React.RefObject<MediaStream | undefined>;
  remoteStream: React.RefObject<MediaStream | undefined>;
  updateStream: (deviceId: string, type: EDeviceType) => void;
  peerConnection: React.RefObject<RTCPeerConnection | undefined>;
}

export enum EDeviceType {
  "audioinput" = "audioinput",
  "audiooutput" = "audiooutput",
}

const DeviceContext = React.createContext<TDeviceContext | undefined>(
  undefined
);

export const DeviceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const localStream = useRef<MediaStream | undefined>(undefined);
  const remoteStream = useRef<MediaStream | undefined>(new MediaStream());
  const peerConnection = useRef<RTCPeerConnection | undefined>(undefined);

  function initializePeerConnection() {
    peerConnection.current = new RTCPeerConnection(config);
    peerConnection.current.ontrack = (event) => {
      event.streams[0]
        .getTracks()
        .forEach((track) => remoteStream.current?.addTrack(track));
    };
  }

  useEffect(() => {
    const getMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStream.current.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(
            track,
            localStream.current as MediaStream
          );
          track.enabled = false;
        });
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };
    getMedia();
    initializePeerConnection();
  }, []);

  const updateStream = async (deviceId: string, type: EDeviceType) => {
    try {
      if (type == EDeviceType.audioinput) {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DeviceContext.Provider
      value={{ localStream, updateStream, peerConnection, remoteStream }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useMic = () => React.useContext(DeviceContext);
