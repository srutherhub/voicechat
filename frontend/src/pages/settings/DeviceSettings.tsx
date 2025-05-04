import { useEffect, useState } from "react";
import { EDeviceType, TDeviceContext, useMic } from "./DeviceContext";

export function DeviceSettings() {
  const [mics, setMics] = useState<MediaDeviceInfo[] | undefined>();
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[] | undefined>();
  const { localStream, updateStream } = useMic() as TDeviceContext;

  async function getConnectedDevices(type: EDeviceType) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind == type);
  }

  useEffect(() => {
    if (!localStream.current) return;
    (async () => {
      const audioInputs = await getConnectedDevices(EDeviceType.audioinput);
      const audioOutputs = await getConnectedDevices(EDeviceType.audiooutput);
      setMics(audioInputs);
      setSpeakers(audioOutputs);
    })();
  }, [localStream]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: EDeviceType
  ) => {
    updateStream(e.target.value, type);
  };

  const displayMics = mics?.map((device, key) => {
    return (
      <option value={device.deviceId} key={key}>
        {device.label}
      </option>
    );
  });
  const displaySpeakers = speakers?.map((device, key) => {
    return (
      <option value={device.deviceId} key={key}>
        {device.label}
      </option>
    );
  });

  return (
    <div style={{ display: "grid", placeItems: "center", padding: "1rem 0 " }}>
      <div style={{ width: "20rem", display: "grid", gap: "2rem" }}>
        <h2>Settings</h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label>Input</label>
          <select
            name="mic-options"
            onChange={(e) => handleSelectChange(e, EDeviceType.audioinput)}
          >
            {displayMics}
          </select>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label>Output</label>
          <select
            name="speaker-options"
            onChange={(e) => handleSelectChange(e, EDeviceType.audiooutput)}
          >
            {displaySpeakers}
          </select>
        </div>
      </div>
    </div>
  );
}
