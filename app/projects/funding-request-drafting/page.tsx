import type { Metadata } from 'next';
import FundingRequestContent from './FundingRequestContent';

export const metadata: Metadata = {
  title: 'AI/LLM Drafting Platform — Enterprise Agentic AI Platform | Harmilap Singh Dhaliwal',
  description:
    'Deep dive into AI/LLM Drafting Platform: an enterprise-wide LangGraph agentic system with MCP tools for project funding requests.',
};

export default function FundingRequestPage() {
  return <FundingRequestContent />;
}
