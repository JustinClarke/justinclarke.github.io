/**
 * content/home.ts the home page's hero and closer copy (headings, bios,
 * tooltips) moved here from the old data/portfolio.ts.
 *
 * Fits in: rendered by the Hero and TheCloser sections. Edit the actual words
 *          HERE the components just lay this data out.
 */
import { HeroMetadata, CloserMetadata } from '@/types';
import { SITE } from './site';

export const heroMetadata: HeroMetadata = {
  role: 'Full-Stack · Analytics Engineer',
  name: 'Justin\nClarke',
  bio: 'Data to decisions & decisions into products',
  cta: 'Get in touch',
  tooltips: {
    role: "I've spent approximately 4,200 hours staring at pipelines. Most of them didn't leak.",
    name: "Fun fact: My terminal and I have a complicated relationship.",
    bio: "I specialise in moving data from place A to place B while making it look easy (it rarely is).",
    cta: "I respond faster than a Power BI refresh. Mostly.",
  }
};

export const closerMetadata: CloserMetadata = {
  heading: "Need a high-performance\ndata partner?",
  subHeading: "Currently open to new projects and engineering engagements.",
  email: SITE.email,
  brandLine: `built with ♥️ by ${SITE.name}`,
  tooltips: {
    email: "No recruiters were harmed in the making of this button",
    logo: "My core brand identity. Simple. Effective.",
  }
};
