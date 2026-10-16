/** YouTube episode as a tap-to-load facade, credited to the channel. Uses youtube-nocookie on tap only. */
export interface VideoFacadeProps {
  video?: { title: string; channel: string; youtubeId: string | null; thumb?: string };
  style?: React.CSSProperties;
}
export declare function VideoFacade(props: VideoFacadeProps): JSX.Element;
