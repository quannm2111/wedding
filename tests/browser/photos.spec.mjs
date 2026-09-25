import { test, expect } from '@playwright/test';

const sizes = [[320, 568], [390, 844], [767, 1024], [768, 1024], [844, 390], [1024, 768], [1366, 768], [1920, 1080], [2560, 1080]];

for (const [width, height] of sizes) {
  test(`portraits remain uncropped at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const selector of ['.hero-photo', '.person-photo img', '.thanks-photo-wrap img']) {
      for (const photo of await page.locator(selector).all()) {
        await photo.scrollIntoViewIfNeeded();
        await expect(photo).toHaveJSProperty('complete', true);
        await expect(photo).not.toHaveJSProperty('naturalWidth', 0);
        await expect(photo).toHaveCSS('object-fit', 'contain');
        await expect(photo).toHaveCSS('transform', 'none');
      }
    }
    const overlapping = await page.evaluate(() => {
      const overlaps = (a, b) => {
        const x = document.querySelector(a).getBoundingClientRect();
        const y = document.querySelector(b).getBoundingClientRect();
        return x.left < y.right && x.right > y.left && x.top < y.bottom && x.bottom > y.top;
      };
      return overlaps('.hero-photo', '.hero-copy') || overlaps('.thanks-photo-wrap img', '.thanks-copy');
    });
    expect(overlapping).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.wedding-hero').screenshot({ path: `test-results/portrait-hero-${width}.png` });
    if ([390, 1920].includes(width)) {
      await page.locator('.person-grid').screenshot({ path: `test-results/portrait-cards-${width}.png` });
      await page.locator('.thanks-banner').screenshot({ path: `test-results/portrait-thanks-${width}.png` });
    }
  });
}
