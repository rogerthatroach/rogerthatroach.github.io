import CombustionDiagram from '@/components/diagrams/CombustionDiagram';
import DocumentIntelligenceDiagram from '@/components/diagrams/DocumentIntelligenceDiagram';
import CommodityTaxDiagram from '@/components/diagrams/CommodityTaxDiagram';
import FinancialBenchmarkingDiagram from '@/components/diagrams/FinancialBenchmarkingDiagram';
import WorkforceAnalyticsDiagram from '@/components/diagrams/WorkforceAnalyticsDiagram';
import FundingRequestDiagram from '@/components/diagrams/FundingRequestDiagram';

// Static registry: each leaf remains a Client Component, but Next can render its
// semantic fallback into the exported case-study HTML.
const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': CombustionDiagram,
  'document-intelligence': DocumentIntelligenceDiagram,
  'commodity-tax': CommodityTaxDiagram,
  'financialBenchmarking': FinancialBenchmarkingDiagram,
  'workforceAnalytics': WorkforceAnalyticsDiagram,
  'funding-request-drafting': FundingRequestDiagram,
};

export default function ProjectDiagram({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug];
  return Diagram ? <Diagram /> : null;
}
