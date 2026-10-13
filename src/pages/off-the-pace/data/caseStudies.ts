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
    finding: "Over the final 13 laps Hamilton gained 11.0s on Verstappen. The car and the later stop explain about 2.8s of it; the other three quarters sits in the residual, which the warehouse cannot split between driving and tyre wear.",
    link: 'https://offthepace.mintlify.app/findings/sao-paulo-2021',
    metrics: [
      { label: 'Tyre-Age Edge (L59-71)', value: '0.86s' },
      { label: 'Car + Tyre Age', value: '2.80s of 11.0s' },
      { label: 'Unexplained Residual', value: '+8.54s', highlight: true },
    ]
  },
  // Future case studies can be added here
];
