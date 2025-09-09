import { useEffect, useState } from "react";

export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState("Unknown");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua) &&window.innerWidth < 768) setDeviceType("mobile");
    else if (/Tablet|iPad/i.test(ua) && window.innerWidth < 1024) setDeviceType("tablet");
    else setDeviceType("desktop");
  }, []);

  return [deviceType];
}
