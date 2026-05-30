import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { isPostSlugPublic } from '@/data/posts';
import CaseStudyLayout from '@/components/projects/CaseStudyLayout';
import ProjectDiagram from '@/components/projects/ProjectDiagram';

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.projectId }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const project = PROJECTS.find((p) => p.id === params.slug);
  if (!project) return {};

  const title = `${project.title} — ${project.subtitle}`;
  return {
    title,
    description: project.caption,
    alternates: { canonical: `/projects/${params.slug}` },
    openGraph: {
      title,
      description: project.caption,
      url: `/projects/${params.slug}`,
      siteName: 'Harmilap Singh Dhaliwal',
      locale: 'en_US',
      type: 'article',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.caption,
      images: ['/og-image.png'],
    },
  };
}

const SITE_URL = 'https://rogerthatroach.github.io';

// CreativeWork JSON-LD for each case study, authored by the single Person
// entity (@id from app/layout.tsx). Pre-rendered server-side.
function caseStudyJsonLd(slug: string) {
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return null;
  const url = `${SITE_URL}/projects/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${project.title} — ${project.subtitle}`,
    abstract: project.caption,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Harmilap Singh Dhaliwal' },
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: 'en',
  };
}

export default async function ProjectCaseStudyPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const project = PROJECTS.find((p) => p.id === params.slug);
  const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === params.slug);

  if (!project || !caseStudy) notFound();

  const jsonLd = caseStudyJsonLd(params.slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CaseStudyLayout
        project={project}
        caseStudy={caseStudy}
        diagram={<ProjectDiagram slug={params.slug} />}
        showFormalBlogCta={isPostSlugPublic(caseStudy.blogPostSlug)}
        showCompanionBlogCta={isPostSlugPublic(caseStudy.companionBlogPostSlug)}
      />
    </>
  );
}
