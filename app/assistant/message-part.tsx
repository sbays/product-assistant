'use client';

import type { ChatAddToolApproveResponseFunction } from 'ai';
import ComparisonTable from './comparison-table';
import EnquiryApproval from './enquiry-approval';
import { ProductDetails, SearchResults } from './product-results';
import { ToolError, ToolPending } from './tool-status';
import type { ChatPart } from './types';

type Props = {
  part: ChatPart;
  productTitles?: ReadonlyMap<number, string>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
};

export default function MessagePart({ part, productTitles, addToolApprovalResponse }: Props) {
  switch (part.type) {
    case 'text':
      return <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>;

    case 'tool-searchProducts':
      switch (part.state) {
        case 'input-streaming':
        case 'input-available':
          return <ToolPending>Searching the catalogue…</ToolPending>;
        case 'output-available':
          return <SearchResults output={part.output} />;
        case 'output-error':
          return <ToolError detail={part.errorText}>Couldn&apos;t search the catalogue.</ToolError>;
        default:
          return null;
      }

    case 'tool-getProducts':
      switch (part.state) {
        case 'input-streaming':
        case 'input-available':
          return <ToolPending>Fetching product details and reviews…</ToolPending>;
        case 'output-available':
          return <ProductDetails output={part.output} />;
        case 'output-error':
          return <ToolError detail={part.errorText}>Couldn&apos;t load product details.</ToolError>;
        default:
          return null;
      }

    case 'tool-showComparison':
      switch (part.state) {
        case 'input-streaming':
          return <ToolPending>Building a comparison…</ToolPending>;
        case 'input-available':
        case 'output-available':
          return <ComparisonTable comparison={part.input} />;
        case 'output-error':
          return <ToolError detail={part.errorText}>Couldn&apos;t build the comparison.</ToolError>;
        default:
          return null;
      }

    case 'tool-sendEnquiry':
      switch (part.state) {
        case 'input-streaming':
        case 'input-available':
          return <ToolPending>Drafting an enquiry…</ToolPending>;
        case 'approval-requested':
          return (
            <EnquiryApproval
              part={part}
              productTitle={productTitles?.get(part.input.productId)}
              addToolApprovalResponse={addToolApprovalResponse}
            />
          );
        case 'approval-responded':
          return part.approval.approved
            ? <ToolPending>Sending your enquiry…</ToolPending>
            : <p className="text-sm text-zinc-500 dark:text-zinc-400">You declined this enquiry.</p>;
        case 'output-available':
          return <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Enquiry sent to the seller.</p>;
        case 'output-denied':
          return <p className="text-sm text-zinc-500 dark:text-zinc-400">Enquiry not sent. You declined it.</p>;
        case 'output-error':
          return <ToolError detail={part.errorText}>Couldn&apos;t send the enquiry.</ToolError>;
        default:
          return null;
      }

    default:
      // step-start, reasoning and other bookkeeping parts have nothing to show
      return null;
  }
}
