import React, { useEffect, useRef, useState, type RefObject } from "react";
import { Text } from "@whoisryosuke/oat-milk-design";

type Props = {
  audio: RefObject<HTMLAudioElement | null>;
};

const AudioTime = ({ audio, ...props }: Props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
    null
  );

  const animate = () => {
    if (!audio.current) return;

    setCurrentTime(audio.current.currentTime);

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div>
      <Text display="flex">
        <Text
          as="span"
          fontWeight="bold"
          color="gray-6"
          style={{ textTransform: "uppercase" }}
        >
          Time
        </Text>
        : {currentTime}
      </Text>
    </div>
  );
};

export default AudioTime;
