import { TDeviceContext, useMic } from "../settings/DeviceContext";

export function CallMenu() {
  return (
    <div className="callmenu-container">
      <AudioPlayer />
      <button>Mute</button>
      <button>Hang up</button>
    </div>
  );
}

function AudioPlayer() {
  const { localStream } = useMic() as TDeviceContext;

  const handleClick = () => {
    const audioContext = new AudioContext();
    if (localStream.current) {
      const source = audioContext.createMediaStreamSource(localStream.current);
      source.connect(audioContext.destination);
      localStream.current
        .getTracks()
        .forEach((track) => (track.enabled = true));
    }
  };

  const handleClick2 = () => {
    if (localStream.current) {
      localStream.current
        .getTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
  };
  return (
    <div>
      <button onClick={() => handleClick()}>Start</button>
      <button onClick={() => handleClick2()}>Mute</button>
    </div>
  );
}
