/** Census 2011 population and households, village or Census Town, panchayat, PIN, nearest station, straight-line km to Panaji and Margao, and the population dot strip. */
export interface VillageFactsProps {
  /** a village place from KhoimData (uses place.census, place.town, place.lp) */
  place: object;
  style?: React.CSSProperties;
}
export declare function VillageFacts(props: VillageFactsProps): JSX.Element;
