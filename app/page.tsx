import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Metrics from '@/components/Metrics';
import SkillTimeline from '@/components/SkillTimeline';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Awards from '@/components/Awards';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Metrics />
      <SkillTimeline />
      <Projects />
      <About />
      <Awards />
      <Footer />
    </main>
  );
}
