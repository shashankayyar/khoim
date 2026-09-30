/** Voices layer: a credited recording of someone local saying the name. Speakers are named, with their village, never anonymous. */
export interface VoiceClipProps {
  /** empty or missing shows "No recordings yet" */
  recordings?: Array<{ speaker: string; village: string; src?: string; duration?: string }>;
  placeName?: string;
  ink?: string;
  paper?: string;
  onRecord?: () => void;
  style?: React.CSSProperties;
}
export declare function VoiceClip(props: VoiceClipProps): JSX.Element;
