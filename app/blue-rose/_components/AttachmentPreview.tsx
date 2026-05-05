'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image as ImageIcon, FileSpreadsheet, X, Download } from 'lucide-react';
import type { Attachment } from '@/data/themis/types';
import { fileSize } from '../_lib/format';
import { hashSeed, mulberry32 } from '../_lib/prng';

const MIME_ICON = (mime: string) => {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime === 'text/csv' || mime.includes('spreadsheet')) return FileSpreadsheet;
  return FileText;
};

const MIME_LABEL = (mime: string) => {
  if (mime === 'application/pdf') return 'PDF';
  if (mime.startsWith('image/')) return mime.split('/')[1].toUpperCase();
  if (mime === 'text/csv') return 'CSV';
  return mime;
};

/**
 * Inline attachment chip — used in lists. Click triggers a parent-controlled
 * preview modal (state lives in ContextPanel).
 */
export function AttachmentChip({
  attachment,
  onPreview,
}: {
  attachment: Attachment;
  onPreview: () => void;
}) {
  const Icon = MIME_ICON(attachment.mime);
  return (
    <button
      type="button"
      onClick={onPreview}
      className="group flex w-full items-center gap-2.5 rounded-lg border border-border-subtle bg-surface/60 px-2.5 py-2 text-left transition-colors hover:border-[var(--themis-primary)]/40 hover:bg-[var(--themis-glass-tint)]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
        style={{ background: 'var(--themis-glass-tint)' }}
      >
        <Icon size={14} style={{ color: 'var(--themis-primary)' }} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[12px] font-medium text-text-primary">
          {attachment.name}
        </span>
        <span className="truncate font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          {MIME_LABEL(attachment.mime)} · {fileSize(attachment.sizeBytes)}
        </span>
      </span>
    </button>
  );
}

/** Generative preview surface — no real files in the bundle. */
function PreviewSurface({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.mime.startsWith('image/');
  const isCsv = attachment.mime === 'text/csv';
  const rng = mulberry32(hashSeed(attachment.id));

  if (isImage) {
    // Soft gradient blob preview
    const a = Math.floor(rng() * 360);
    const b = (a + 60 + Math.floor(rng() * 80)) % 360;
    return (
      <div
        className="aspect-[4/3] w-full rounded-lg"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, hsl(${a} 50% 70% / 0.6), transparent 60%), radial-gradient(ellipse at 70% 70%, hsl(${b} 50% 70% / 0.6), transparent 60%), var(--color-surface)`,
        }}
      />
    );
  }

  if (isCsv) {
    // Generated table-like preview
    const rows = 5;
    const cols = 4;
    return (
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface/60">
        <table className="w-full font-mono text-[10.5px]">
          <thead className="border-b border-border-subtle bg-surface-hover/60">
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-2 py-1.5 text-left text-text-secondary">
                  col_{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="border-b border-border-subtle/40 last:border-0">
                {Array.from({ length: cols }).map((__, c) => (
                  <td key={c} className="px-2 py-1.5 text-text-tertiary">
                    {Math.round(rng() * 1000) / 100}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border-subtle bg-surface/40 px-2 py-1.5 text-center font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          preview · synthetic · {fileSize(attachment.sizeBytes)}
        </div>
      </div>
    );
  }

  // PDF / generic — stylized "document" page
  const lineCount = 9;
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border-subtle bg-surface/80 px-5 py-6 shadow-[0_1px_0_inset_rgba(255,255,255,0.04)]">
      <div className="mb-4 h-2 w-1/2 rounded-full bg-text-primary/40" />
      <div className="mb-4 h-1.5 w-1/3 rounded-full bg-text-tertiary/40" />
      <div className="space-y-2">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full bg-text-tertiary/20"
            style={{ width: `${60 + Math.round(rng() * 35)}%` }}
          />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-text-tertiary/20" />
        ))}
      </div>
    </div>
  );
}

export function AttachmentPreviewModal({
  attachment,
  onClose,
}: {
  attachment: Attachment | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!attachment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [attachment, onClose]);

  return (
    <AnimatePresence>
      {attachment && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${attachment.name}`}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="themis-glass relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-text-primary">
                  {attachment.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  {MIME_LABEL(attachment.mime)} · {fileSize(attachment.sizeBytes)} · synthetic preview
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  aria-label="Download (mocked)"
                  title="Download (mocked)"
                  onClick={(e) => e.preventDefault()}
                >
                  <Download size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </div>
            </header>
            <div className="max-h-[75vh] overflow-auto p-4">
              <PreviewSurface attachment={attachment} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
