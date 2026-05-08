import { expect, test } from '@playwright/test';

test.describe('Onesiker — golden paths', () => {
  test('homepage renders every section declared in layout.json', async ({ page, request }) => {
    // Read the actual layout.json the build is shipping. If a section is added /
    // renamed in JSON, this test stays in sync without code changes.
    const layoutResp = await request.get('/data/layout.json');
    expect(layoutResp.ok()).toBe(true);
    const layout = (await layoutResp.json()) as {
      sections: { id: string; visible: boolean }[];
    };
    const visibleIds = layout.sections.filter((s) => s.visible).map((s) => s.id);
    expect(visibleIds.length).toBeGreaterThan(0);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Hero is always present, regardless of layout.
    await expect(page.locator('h1', { hasText: 'Onesiker' }).first()).toBeVisible();

    for (const id of visibleIds) {
      await expect(page.locator(`#${id}`)).toBeAttached({ timeout: 10_000 });
    }
  });

  test('artworks lightbox opens on zoom click', async ({ page }) => {
    await page.goto('/#artworks', { waitUntil: 'domcontentloaded' });

    const artworks = page.locator('#artworks');
    await expect(artworks).toBeVisible();

    const zoomButton = artworks.getByRole('button', { name: /zoom image/i }).first();
    await zoomButton.scrollIntoViewIfNeeded();
    await zoomButton.click();

    // Lightbox: full-screen overlay with a Close button.
    const closeButton = page.getByRole('button', { name: /close zoom/i });
    await expect(closeButton).toBeVisible();

    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
  });

  test('CGU modal opens from the footer and closes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const cguTrigger = page.getByRole('button', { name: 'CGU' });
    await cguTrigger.scrollIntoViewIfNeeded();
    await cguTrigger.click();

    // Modal contains a heading with "CGU" or "Conditions" — match either FR or EN.
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2,h3').first()).toContainText(/CGU|Conditions|Terms/i);

    // Close via the X button or Escape.
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});
