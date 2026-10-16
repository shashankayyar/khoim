/** Share image for a place, rendered at real pixel size: og 1200x630 (link preview), square 1080x1080, story 1080x1920. House colour, trim frame, the place's own shape, Devanagari and Romi at the same size, official smaller, wordmark and khoim.in. Generate at build time. Uses reviewed names only (p.deva, p.romi); unreviewed forms never appear on a card. */
export interface ShareCardProps {
  place: string | object;
  format?: 'og' | 'square' | 'story';
  style?: React.CSSProperties;
}
export declare function ShareCard(props: ShareCardProps): JSX.Element;
