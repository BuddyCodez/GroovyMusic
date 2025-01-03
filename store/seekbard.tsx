'use client';
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
const Seekbar = createContext({
  progress: 0,
  dragging: false,
  SetProgress: (value: number) => {},
  SetDragging: (value: boolean) => {},
});
export const useSeekbar = () => useContext(Seekbar);
import { ReactNode } from "react";

export const SeekbarProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const SetProgress = (value: SetStateAction<number>) => {
    setProgress(value);
  };
  const SetDragging = (value: boolean | ((prevState: boolean) => boolean)) => {
    setDragging(value);
  };
  return (
    <Seekbar.Provider value={{ progress, dragging, SetProgress, SetDragging }}>
      {children}
    </Seekbar.Provider>
  );
};
export default SeekbarProvider;
