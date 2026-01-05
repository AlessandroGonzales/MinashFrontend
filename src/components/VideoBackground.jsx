import { useEffect, useState } from "react";
import VideoBackgroundCore from "./VideoBackgroundCore";

export default function VideoBackground(props) {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const onResize = () =>
      setIsPortrait(window.innerHeight > window.innerWidth);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isPortrait ? (
    <VideoBackgroundCore variant="mobile" {...props} />
  ) : (
    <VideoBackgroundCore variant="desktop" {...props} />
  );
}
