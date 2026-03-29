import type { Metadata } from 'next';
import PARAssistContent from './PARAssistContent';

export const metadata: Metadata = {
  title: 'PAR Assist — Enterprise Agentic AI Platform | Harmilap Singh Dhaliwal',
  description:
    'Deep dive into PAR Assist: an enterprise-wide LangGraph agentic system with MCP tools for Project Approval Requests.',
};

export default function PARAssistPage() {
  return <PARAssistContent />;
}
