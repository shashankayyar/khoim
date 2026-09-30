import './core.css';

export interface CreditProps {
  /** Adds the Konkani sources and licence line. */
  full?: boolean;
}

/** The credit line, verbatim. Never reword. */
export function Credit({ full = false }: CreditProps) {
  return (
    <div className="k-credit">
      <p>Khoim is a non-profit initiative by Pangolin Marketing. Boundaries and official names: Local Government Directory, Government of India.</p>
      {full && <p>Konkani names: Goa district websites, Konkani Vishwakosh (Goa University), Konkani Wikipedia. Data licence to be confirmed.</p>}
    </div>
  );
}
