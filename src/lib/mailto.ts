/* Email links. Subjects and body lines are verbatim from docs/email-and-icons.md. All go to hello@khoim.in. */
import { CONTACT_EMAIL } from '../data/site';

function mailto(subject: string, bodyFirstLine?: string): string {
  const parts = ['subject=' + encodeURIComponent(subject)];
  // Two line breaks after the first line, so the person starts typing below it.
  // Written as CR LF, the form the email standard asks for; some mail apps ignore a bare LF.
  if (bodyFirstLine) parts.push('body=' + encodeURIComponent(bodyFirstLine + '\r\n\r\n'));
  return `mailto:${CONTACT_EMAIL}?${parts.join('&')}`;
}

/** About, "Write to us". */
export function writeToUsHref(): string {
  return mailto('Helping with Khoim');
}

/** Draft banner, "Tell us what is wrong". pageUrl is the full khoim.in URL of the current page. */
export function tellUsWhatIsWrongHref(pageUrl: string): string {
  return mailto('Something on Khoim needs fixing', `Page: ${pageUrl}`);
}

export interface MailPlace {
  /** LGD official name. */
  official: string;
  /** Official name of the taluka the village is in. Leave out for districts and talukas. */
  taluka?: string;
  /** LGD village code. Districts and talukas have none here. */
  lgd?: string | null;
}

function placeLabel({ official, taluka }: MailPlace): string {
  return taluka ? `${official}, ${taluka}` : official;
}

function placeLine(place: MailPlace): string {
  const { taluka, lgd } = place;
  // Districts and talukas: "Place: {Official}" only.
  if (!taluka) return `Place: ${place.official}`;
  return `Place: ${placeLabel(place)}${lgd ? `, LGD ${lgd}` : ''}`;
}

/** Village card, "Tell us" (no Konkani name yet). */
export function tellUsNameHref(place: MailPlace): string {
  return mailto(`Konkani name for ${placeLabel(place)}`, placeLine(place));
}

/** Correction on a named place. */
export function correctionHref(place: MailPlace): string {
  return mailto(`Correction for ${placeLabel(place)}`, placeLine(place));
}
