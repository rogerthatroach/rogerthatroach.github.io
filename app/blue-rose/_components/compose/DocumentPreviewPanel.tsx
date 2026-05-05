'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import {
  PAR_SECTIONS,
  isFieldFilled,
  type FieldSpec,
  type SectionSpec,
} from '../../_lib/par-schema';

interface DocumentPreviewPanelProps {
  open: boolean;
  values: Record<string, string | number | boolean>;
  draftId: string;
  onClose: () => void;
  onDownload?: () => void;
}

const HEADER_FIELDS_LEFT: string[] = ['request_title', 'request_category', 'sponsor_segment', 'sponsor_unit', 'classification'];
const HEADER_FIELDS_RIGHT: string[] = ['executive_sponsor', 'sponsor_delegate', 'par_contact', 'eds_contact', 'initiative_type'];

/**
 * DocumentPreviewPanel — slide-out side panel rendering the PAR draft
 * as a formal RBC EDS Workflow document.
 *
 * Matches screenshot 3: branded header (RBC Enterprise Decision Support
 * + EDS Workflow / Project Funding Request title), confidentiality
 * line, "All amounts in CAD", 2-column header field table, then full
 * prose sections. White Lodge restyling preserves the formal-document
 * feel (Fraunces titles, classic serif body, paper background) so a
 * stakeholder reads it as a real document, not a UI surface.
 *
 * Replaces the form pane on the right when open; the chat pane on the
 * left stays put. Close button + download icon in the panel header.
 */
export default function DocumentPreviewPanel({
  open,
  values,
  draftId,
  onClose,
  onDownload,
}: DocumentPreviewPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-label="Document preview"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          className="absolute inset-0 z-20 flex h-full min-h-0 flex-col bg-surface/95 backdrop-blur-md"
        >
          {/* Panel header */}
          <header className="flex shrink-0 items-center gap-3 border-b border-border-subtle/60 px-5 py-3">
            <h2 className="font-display text-[14px] font-medium text-text-primary">
              Document Preview
            </h2>
            <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
              {draftId}
            </span>
            <button
              type="button"
              onClick={onDownload}
              aria-label="Download as .docx"
              className="ml-auto rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              title="Download as .docx (POC: print-CSS only)"
            >
              <Download size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </header>

          {/* Document body — paper-feel, scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fdfaf3] dark:bg-[#1a1620]">
            <article className="mx-auto max-w-3xl px-8 py-10 text-[#2a2526] dark:text-[#e6dfe1]">
              {/* Branded header */}
              <header className="border-b-2 border-[#003168] pb-4 dark:border-[#5e8bcf]">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded font-display text-[10px] font-bold leading-tight text-white"
                      style={{ background: '#003168' }}
                    >
                      RBC
                    </span>
                    <div className="text-[10px] uppercase leading-tight tracking-wider text-[#003168] dark:text-[#5e8bcf]">
                      <p>Enterprise</p>
                      <p>Decision</p>
                      <p>Support</p>
                    </div>
                  </div>
                  <h1
                    className="font-display text-[26px] font-medium leading-none"
                    style={{ color: '#003168' }}
                  >
                    EDS Workflow
                  </h1>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#003168] dark:text-[#5e8bcf]">
                    Project Funding Request
                  </span>
                </div>
                <p className="mt-3 text-center text-[11px] italic text-[#5a5054] dark:text-[#9a9094]">
                  Private &amp; Confidential — Not to be Distributed Further
                </p>
                <p className="text-center text-[11px] italic text-[#5a5054] dark:text-[#9a9094]">
                  All amounts in CAD
                </p>
              </header>

              {/* Header info — 2-column table */}
              <table className="mt-5 w-full border-collapse text-[12.5px]">
                <tbody>
                  {Array.from({
                    length: Math.max(HEADER_FIELDS_LEFT.length, HEADER_FIELDS_RIGHT.length),
                  }).map((_, i) => {
                    const leftKey = HEADER_FIELDS_LEFT[i];
                    const rightKey = HEADER_FIELDS_RIGHT[i];
                    return (
                      <tr key={i} className="border-b border-[#d6cfc1] dark:border-[#3a3640]">
                        <HeaderCell fieldKey={leftKey} values={values} />
                        <HeaderCell fieldKey={rightKey} values={values} />
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Prose sections (skip Headers Information; render the rest) */}
              <div className="mt-8 space-y-7">
                {PAR_SECTIONS.filter((s) => s.id !== 'headers').map((section) => (
                  <ProseSection key={section.id} section={section} values={values} />
                ))}
              </div>
            </article>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function HeaderCell({
  fieldKey,
  values,
}: {
  fieldKey: string | undefined;
  values: Record<string, string | number | boolean>;
}) {
  if (!fieldKey) return <td className="w-1/2 px-3 py-1.5" colSpan={2} />;
  const field = findField(fieldKey);
  const value = values[fieldKey];
  return (
    <>
      <td className="w-[22%] bg-[#f3ece0] px-3 py-1.5 align-top font-medium dark:bg-[#23202c]">
        {field?.label ?? fieldKey}:
      </td>
      <td className="w-[28%] px-3 py-1.5 align-top">
        {isFieldFilled(value) ? String(value) : ''}
      </td>
    </>
  );
}

function ProseSection({
  section,
  values,
}: {
  section: SectionSpec;
  values: Record<string, string | number | boolean>;
}) {
  const filledFields = section.fields.filter((f) => isFieldFilled(values[f.key]));
  if (filledFields.length === 0) {
    return (
      <section>
        <h2
          className="border-b border-[#d6cfc1] pb-1 font-display text-[16px] font-medium dark:border-[#3a3640]"
          style={{ color: '#003168' }}
        >
          {section.title}
        </h2>
        <p className="mt-2 text-[12px] italic text-[#9a9094]">[Section pending content]</p>
      </section>
    );
  }
  return (
    <section>
      <h2
        className="border-b border-[#d6cfc1] pb-1 font-display text-[16px] font-medium dark:border-[#3a3640]"
        style={{ color: '#003168' }}
      >
        {section.title}
      </h2>
      <dl className="mt-3 space-y-3">
        {filledFields.map((field) => (
          <div key={field.key}>
            <dt className="text-[11px] font-bold uppercase tracking-wider">
              {field.label}:
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed">
              {String(values[field.key])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function findField(key: string): FieldSpec | undefined {
  for (const section of PAR_SECTIONS) {
    const f = section.fields.find((x) => x.key === key);
    if (f) return f;
  }
  return undefined;
}
