/**
 * caseStudies the data for the "Findings" / case-study cards: each entry is one
 * attributed race analysis with a headline finding and a few metric chips.
 *
 * Fits in: imported by CaseStudiesSection, which maps each entry to a card.
 * Note:    Add new findings to the CASE_STUDIES array; the UI grows to fit.
 */
export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  finding: string;
  link: string;
  date: string;
  metrics: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'sao-paulo-2021',
    title: 'São Paulo Grand Prix',
    subtitle: 'Was it the driver or the strategy?',
    date: 'Nov 14, 2021',
    finding: "Hamilton's 10.5s win was built on a precise mix of a 2.9s strategic tyre advantage and outdriving his car by 1.6s on the decisive overtake lap.",
    link: 'https://offthepace.mintlify.app/findings/sao-paulo-2021',
    metrics: [
      { label: 'Strategic Tyre Adv.', value: '-2.91s' },
      { label: 'Overtake Lap Skill Delta', value: '-1.59s', highlight: true },
      { label: 'Max Lap Overperformance', value: '-12.86s' },
    ]
  },
  // Future case studies can be added here
];
