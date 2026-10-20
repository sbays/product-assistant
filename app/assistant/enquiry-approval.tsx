'use client';

import { useEffect, useId, useRef } from 'react';
import type { ChatAddToolApproveResponseFunction } from 'ai';
import type { ToolPart } from './types';

type ApprovalRequestedPart = Extract<ToolPart<'sendEnquiry'>, { state: 'approval-requested' }>;

type Props = {
  part: ApprovalRequestedPart;
  productTitle?: string;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
};

const buttonBase =
  'rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white';

export default function EnquiryApproval({ part, productTitle, addToolApprovalResponse }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const headingId = useId();
  const { productId, message } = part.input;

  // Move focus here when the request appears, so keyboard and screen reader users land on the decision
  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const respond = (approved: boolean) => addToolApprovalResponse({ id: part.approval.id, approved });

  return (
    <section
      ref={cardRef}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 focus:outline-2 focus:outline-offset-2 focus:outline-amber-500 dark:border-amber-700 dark:bg-amber-950/40"
    >
      <h3 id={headingId} className="font-semibold">
        Send this enquiry to the seller?
      </h3>
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Product</dt>
          <dd>
            {productTitle ? `${productTitle} ` : ''}
            <span className="text-zinc-500 dark:text-zinc-400">(ID {productId})</span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Message</dt>
          <dd>
            <blockquote className="mt-1 whitespace-pre-wrap rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-zinc-900">
              {message}
            </blockquote>
          </dd>
        </div>
      </dl>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Nothing is sent until you approve.</p>
      {part.approval.isAutomatic ? null : (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => respond(true)}
            className={`${buttonBase} bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200`}
          >
            Approve and send
          </button>
          <button
            type="button"
            onClick={() => respond(false)}
            className={`${buttonBase} border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800`}
          >
            Decline
          </button>
        </div>
      )}
    </section>
  );
}
