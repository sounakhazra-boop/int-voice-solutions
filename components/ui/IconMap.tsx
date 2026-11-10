// src/components/ui/IconMap.tsx
"use client";

import React from "react";
import {
  Waveform,
  Robot,
  ChatCircleDots,
  Monitor,
  Translate,
  Microphone,
  Fingerprint,
  ChartBar,
  PlayCircle,
  Lightning,
  CheckCircle,
  Headset,
  Users,
  Buildings,
  ShieldCheck,
  ShoppingCart,
  Factory,
  FirstAid,
} from "@phosphor-icons/react";

interface IconMapProps {
  name: string;
  className?: string;
  weight?: "regular" | "bold" | "fill" | "duotone";
}

export const IconMap: React.FC<IconMapProps> = ({
  name,
  className,
  weight = "duotone",
}) => {
  const iconProps = { className, weight, size: "100%" };

  switch (name) {
    // Initiatives
    case "vyom":
      return <Waveform {...iconProps} />;
    case "voicebot":
      return <Robot {...iconProps} />;
    case "chatbot":
      return <ChatCircleDots {...iconProps} />;
    case "agui":
      return <Monitor {...iconProps} />;
    case "vaani":
      return <Translate {...iconProps} />;
    case "offline-recording":
      return <Microphone {...iconProps} />;
    case "voice-biometric":
      return <Fingerprint {...iconProps} />;
    case "conversations-analyst":
      return <ChartBar {...iconProps} />;

    // Use Cases
    case "recruitment":
      return <Users {...iconProps} />;
    case "real-estate":
      return <Buildings {...iconProps} />;
    case "insurance":
      return <ShieldCheck {...iconProps} />;
    case "ecommerce":
      return <ShoppingCart {...iconProps} />;
    case "manufacturing":
      return <Factory {...iconProps} />;
    case "healthcare":
      return <FirstAid {...iconProps} />;
    case "customer-service":
      return <Headset {...iconProps} />;

    // General UI
    case "lightning":
      return <Lightning {...iconProps} weight="fill" />;
    case "check":
      return <CheckCircle {...iconProps} weight="fill" />;
    case "play":
      return <PlayCircle {...iconProps} />;

    default:
      return <Waveform {...iconProps} />;
  }
};
