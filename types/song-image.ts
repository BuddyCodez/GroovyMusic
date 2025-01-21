export type ImageSource = {
  url: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export type SongImageState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  currentIndex: number;
  error?: Error;
}

export type SongImageAction = 
  | { type: 'START_LOADING' }
  | { type: 'LOAD_SUCCESS' }
  | { type: 'LOAD_ERROR' }
  | { type: 'TRY_NEXT_SOURCE' }
  | { type: 'RESET' }

  export interface SongImageProps {
    images: { url: string; size: string }[];
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    isBlurred?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    fallback?: React.ReactNode;
  }
  
