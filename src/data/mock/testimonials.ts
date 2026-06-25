import type { Testimonial } from './types';

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Dr. Sarah Mitchell',
    role: 'Investigative Journalist',
    organization: 'Global News Network',
    content:
      'Factify has transformed how our newsroom verifies breaking stories. The source credibility analysis and cross-referencing save us hours of manual research every day.',
    avatar: 'SM',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    name: 'James Okonkwo',
    role: 'Media Literacy Educator',
    organization: 'University of Accra',
    content:
      'I use Factify in my classrooms to teach students critical thinking about news. The transparent AI explanations help them understand why a claim is true or false.',
    avatar: 'JO',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    name: 'Emily Chen',
    role: 'Policy Researcher',
    organization: 'Institute for Digital Democracy',
    content:
      'The detailed verification reports with supporting and contradicting sources are exactly what policy researchers need. Factify sets a new standard for fact-checking tools.',
    avatar: 'EC',
    rating: 5,
  },
  {
    id: 'testimonial-4',
    name: 'Michael Torres',
    role: 'Community Manager',
    organization: 'FactCheck Alliance',
    content:
      'We monitor trending misinformation daily. Factify\'s AI monitoring and risk level assessments help us prioritize which viral claims need immediate debunking.',
    avatar: 'MT',
    rating: 4,
  },
  {
    id: 'testimonial-5',
    name: 'Amina Hassan',
    role: 'Government Communications Director',
    organization: 'Ministry of Information',
    content:
      'During crisis communications, speed and accuracy matter. Factify gives us confidence that the information we share with the public has been thoroughly verified.',
    avatar: 'AH',
    rating: 5,
  },
  {
    id: 'testimonial-6',
    name: 'David Park',
    role: 'Student Researcher',
    organization: 'MIT Media Lab',
    content:
      'As a student researching misinformation, Factify\'s exportable reports and source analysis have been invaluable for my thesis on viral fake news patterns.',
    avatar: 'DP',
    rating: 5,
  },
];

export const platformStats = [
  { value: 100000, suffix: '+', label: 'News Verifications' },
  { value: 95, suffix: '%', label: 'Verification Accuracy' },
  { value: 500, suffix: '+', label: 'Trusted News Sources' },
  { value: 24, suffix: '/7', label: 'AI Monitoring' },
];
