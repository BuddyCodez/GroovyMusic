"use client";

import { QueueSheet } from "@/features/player/components/queueSheet";
import { useMountedState } from "react-use";

export const SheetsProvider = ({}) => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <QueueSheet />
    </>
  );
};
