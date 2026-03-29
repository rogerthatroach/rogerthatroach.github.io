'use client';

import Section from '@/components/ui/Section';
import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/data/projects';

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-4">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
