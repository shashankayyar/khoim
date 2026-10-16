/** What a village is known for: protected monument, GI product, parish feast, zatra, festival. Dated items get a FeastStrip. */
export interface KnownForProps {
  items?: Array<{ kind: 'monument' | 'gi' | 'parish' | 'zatra' | 'festival'; icon: string; title: string; detail?: string; when?: object; whenText?: string; source: string }>;
  today?: Date;
  style?: React.CSSProperties;
}
export declare function KnownFor(props: KnownForProps): JSX.Element;
