import './core.css';

export interface CreditProps {
  /** Adds the Konkani sources and the licences. */
  full?: boolean;
}

/** The credit line, verbatim. Never reword. */
export function Credit({ full = false }: CreditProps) {
  return (
    <div className="k-credit">
      <p>Khoim is a non-profit initiative by Pangolin Marketing. Boundaries and official names: Local Government Directory, Government of India.</p>
      {/* The design said "Data licence to be confirmed." It has since been settled (DATA-LICENSE.md); this is the footer wording from docs/copy.md. */}
      {full && <p>Konkani names: Goa district websites, Konkani Vishwakosh (Goa University), Konkani Wikipedia. Khoim's own names and notes: CC BY 4.0. Government codes and official names: GODL-India.</p>}
    </div>
  );
}
