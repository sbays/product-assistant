import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

// The chat is deliberately not covered here, so CI never spends model tokens

const stockBadge = /^(\d+ in stock|Out of stock)$/;

test.describe('Catalogue', () => {
  test('lists products', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { level: 1, name: 'Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Essence Mascara Lash Princess/ })).toBeVisible();
  });

  test('a product link shows the cached details instantly, then streams in stock', async ({ page }) => {
    await page.goto('/products');
    const link = page.locator('a[href="/products/1"]');
    await expect(link).toBeVisible();
    // Cards resolve their product data on hover (see HoverPrefetchLink), so show intent first
    await link.hover();
    await page.waitForLoadState('networkidle');

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === '/products/1');
      // Product details are cached, so they're in the prefetched UI
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Essence Mascara Lash Princess');
      // Stock is request-time data, so it must not be there yet
      await expect(page.getByText(stockBadge)).toHaveCount(0);
    });

    await expect(page.getByText(stockBadge)).toBeVisible();
  });
});
