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
    link: 'https://off-the-pace.onrender.com/attributed-findings/sao-paulo-2021',
    metrics: [
      { label: 'Strategic Tyre Adv.', value: '-2.91s' },
      { label: 'Overtake Lap Skill Delta', value: '-1.59s', highlight: true },
      { label: 'Max Lap Overperformance', value: '-12.86s' },
    ]
  },
  // Future case studies can be added here
];
