import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ExploreExperience from '@/components/resume/explore/ExploreExperience';

export const metadata: Metadata = {
  title: 'Resume · Explore — Harmilap Singh Dhaliwal',
  description:
    '3D spatial career timeline. Four eras as floating planes; projects as clickable nodes. Orbit, click, drill into a role. Desktop experimental variant of the interactive resume.',
  alternates: { canonical: '/resume/explore' },
  openGraph: {
    title: 'Resume · Explore — Harmilap Singh Dhaliwal',
    description:
      'Career as a spatial timeline. Four abstraction levels, each a floating plane with clickable project nodes.',
    url: 'https://rogerthatroach.github.io/resume/explore',
    type: 'profile',
  },
};

export default function ExploreResumePage() {
  return (
    <main id="main-content" className="resume-page resume-explore">
      <Nav />
      <ExploreExperience />
      <Footer />
    </main>
  );
}
