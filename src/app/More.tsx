/* About, help and layers: the "More" screen. Copy is verbatim from design/ui_kits/khoim/More.jsx. */
import { useRef } from 'react';
import { Button } from '../components/core/Button';
import { Credit } from '../components/core/Credit';
import { DraftBanner } from '../components/core/DraftBanner';
import { IconButton } from '../components/core/IconButton';
import { Wordmark } from '../components/core/Wordmark';
import { LayerSwitch } from '../components/layers/LayerSwitch';
import { CONTACT_EMAIL } from '../data/site';
import { useDialog } from '../lib/dialog';
import { tellUsWhatIsWrongHref, writeToUsHref } from '../lib/mailto';
import { useTheme } from '../lib/theme';
import './more.css';

const ROLES: [title: string, body: string][] = [
  ['Konkani reviewers', "Look over the Konkani names for your taluka in Devanagari or Romi. Fix what's wrong and tell us how your family says it. A phone is enough."],
  ['Voice recorders', 'Record yourself saying the names of your village and the places around it. A phone in a quiet room works. Older voices especially welcome. Credit is optional.'],
  ['Archivists, musicians', 'Send old maps, gazetteers or parish registers showing how a place name was spelt over time. If you sing mando or dulpod, tell us where songs belong.'],
  ['Developers, designers', 'The data is open. We need the map to work offline and on slow networks, and Devanagari and Romi to read well on older budget Android phones.']
];

export interface MoreProps {
  open: boolean;
  onClose: () => void;
  layer: string;
  onLayer: (id: string) => void;
  /** Opens the contribution form from the draft banner. When missing, the banner opens an email. */
  onTellUs?: () => void;
}

export function More({ open, onClose, layer, onLayer, onTellUs }: MoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, toggleTheme] = useTheme();
  useDialog(ref, open, onClose);
  return (
    <div ref={ref} className={open ? 'k-more is-open' : 'k-more'} role="dialog" aria-modal="true" aria-label="About Khoim" aria-hidden={!open} tabIndex={-1}>
      {onTellUs ? <DraftBanner onTellUs={onTellUs} /> : <DraftBanner tellUsHref={tellUsWhatIsWrongHref(window.location.href)} />}
      <div className="k-more__scroll">
        <div className="k-more__column">
          <div className="k-more__top">
            <Wordmark size={40} />
            <div className="k-more__tools">
              <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label={theme === 'dark' ? 'Use light colours' : 'Use dark colours'} onClick={toggleTheme} />
              <IconButton icon="x" label="Close" onClick={onClose} />
            </div>
          </div>
          <p className="k-more__lead">Khoim means "where" in Konkani. Every taluka in Goa, with its Konkani name and how to say it.</p>

          <section className="k-more__section" aria-labelledby="k-layers">
            <h2 id="k-layers">Layers</h2>
            <p>Names are live. The rest are coming, one at a time, each credited to the people who give them.</p>
            <LayerSwitch value={layer} onChange={onLayer} />
          </section>

          <section className="k-more__section" aria-labelledby="k-why">
            <h2 id="k-why">Why Khoim</h2>
            <p>Most places in Goa have an official spelling and a Konkani name, and the two often don't match. Canacona is <span lang="gom">काणकोण</span>, written Kannkonn in Romi. Many official spellings come from Portuguese-era records and are what you see on boards, maps and bills.</p>
            <p>If you grew up here you know both. A Goan kid growing up in Pune or Toronto often doesn't, and neither does someone who moved here last year.</p>
          </section>

          <section className="k-more__section" aria-labelledby="k-src">
            <h2 id="k-src">Where the names come from</h2>
            <p>District, taluka and village names and boundaries come from the Local Government Directory (LGD) of the Government of India, spelt exactly as the government spells them.</p>
            <p>The Konkani names for districts and talukas come from the district websites of Goa and published Konkani sources. For Bardez, Tiswadi, Salcete, Quepem and South Goa those sources differ, and each of those cards says so. Dharbandora shows only its official name until the Directorate of Official Language confirms the Konkani.</p>
            <p>The pronunciation guides are our own rough respellings. No Konkani speaker has checked them yet.</p>
          </section>

          <section className="k-more__section" aria-labelledby="k-scripts">
            <h2 id="k-scripts">A note on scripts</h2>
            <p>Konkani is written in Devanagari, the official script under the Goa, Daman and Diu Official Language Act, 1987, and in Romi, the Roman script used in church, in tiatr and in many homes. Khoim shows Devanagari and Romi side by side and doesn't pick between them.</p>
          </section>

          <section className="k-more__section" aria-labelledby="k-help">
            <h2 id="k-help">Help us</h2>
            <p>Write to us at <strong>{CONTACT_EMAIL}</strong>. Everyone who contributes is credited by name, if they want to be.</p>
            <div className="k-more__roles">
              {ROLES.map(([title, body]) => <article key={title} className="k-more__role"><h3>{title}</h3><p>{body}</p></article>)}
            </div>
            <Button icon="mail" href={writeToUsHref()}>Write to us</Button>
          </section>

          <section className="k-more__section k-more__credit">
            <Credit full />
            {/* The brief asks for the GODL-India attribution with the lgdirectory.gov.in address on this screen.
                The design has no line for it, so the wording is taken from DATA-LICENSE.md. */}
            <p className="k-more__licence">
              Village codes and official names: Local Government Directory, Ministry of Panchayati Raj, Government of India (<a href="https://lgdirectory.gov.in/">lgdirectory.gov.in</a>), licensed under the Government Open Data License India (GODL-India). This use is not endorsed by the Government of India.
            </p>
            <p className="k-more__licence"><a className="k-more__link" href="/privacy/">Privacy notice</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
