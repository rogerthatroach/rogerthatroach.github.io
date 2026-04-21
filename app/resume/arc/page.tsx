import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ArcExperience from '@/components/resume/arc/ArcExperience';

export const metadata: Metadata = {
  title: 'Resume · Arc — Harmilap Singh Dhaliwal',
  description:
    'Career arc as scroll-driven narrative: the closed-loop pattern (sense → model → optimize → act) at four ascending abstraction levels. Scrollytelling variant of the interactive resume.',
  alternates: { canonical: '/resume/arc' },
  openGraph: {
    title: 'Resume · Arc — Harmilap Singh Dhaliwal',
    description:
      'Scroll-driven career narrative. Same closed-loop pattern at four levels of abstraction.',
    url: 'https://rogerthatroach.github.io/resume/arc',
    type: 'profile',
  },
};

export default function ArcResumePage() {
  return (
    <main id="main-content" className="resume-page resume-arc">
      <Nav />
      <ArcExperience />
      <Footer />
    </main>
  );
}
