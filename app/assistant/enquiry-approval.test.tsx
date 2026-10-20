// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MessagePart from './message-part';
import type { ToolPart } from './types';

const approvalPart: ToolPart<'sendEnquiry'> = {
  type: 'tool-sendEnquiry',
  toolCallId: 'call-1',
  state: 'approval-requested',
  input: { productId: 1, message: 'Hello, is this still in stock?' },
  approval: { id: 'approval-42' },
};

afterEach(cleanup);

describe('enquiry approval card', () => {
  it('shows exactly what will be sent and approves with the approval ID', async () => {
    const addToolApprovalResponse = vi.fn();
    render(
      <MessagePart
        part={approvalPart}
        productTitles={new Map([[1, 'Essence Mascara Lash Princess']])}
        addToolApprovalResponse={addToolApprovalResponse}
      />,
    );

    const card = screen.getByRole('region', { name: /send this enquiry/i });
    expect(card).toHaveProperty('textContent', expect.stringContaining('Essence Mascara Lash Princess'));
    expect(card).toHaveProperty('textContent', expect.stringContaining('Hello, is this still in stock?'));
    expect(document.activeElement).toBe(card);

    await userEvent.click(screen.getByRole('button', { name: /approve/i }));

    expect(addToolApprovalResponse).toHaveBeenCalledTimes(1);
    expect(addToolApprovalResponse).toHaveBeenCalledWith({ id: 'approval-42', approved: true });
  });

  it('declines from the keyboard', async () => {
    const addToolApprovalResponse = vi.fn();
    const user = userEvent.setup();
    render(<MessagePart part={approvalPart} addToolApprovalResponse={addToolApprovalResponse} />);

    await user.tab(); // Approve
    await user.tab(); // Decline
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /decline/i }));
    await user.keyboard('{Enter}');

    expect(addToolApprovalResponse).toHaveBeenCalledWith({ id: 'approval-42', approved: false });
  });
});
