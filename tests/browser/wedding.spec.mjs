import { test, expect } from '@playwright/test';

for (const width of [360, 390, 768, 1440]) {
  test(`layout and guest dialog at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.locator('.envelope-seal').click();
    await expect(page.locator('.envelope-screen')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Quân');
    await expect(page.locator('.hero-photo')).toHaveJSProperty('complete', true);
    await expect(page.locator('.hero-photo')).not.toHaveJSProperty('naturalWidth', 0);
    await page.locator('.wedding-hero').screenshot({ path: `test-results/hero-${width}.png` });
    await expect(page.locator('.wedding-day')).toHaveText('25');
    await expect(page.locator('.vuquy-day')).toHaveText('24');
    for (const id of ['InvitationSection', 'CoupleImageSection', 'SaveTheDateSection', 'WeddingAlbumSection', 'TimelineSection', 'ThankYouSection']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      for (const reveal of await page.locator(`#${id} .scroll-reveal`).all()) {
        await reveal.scrollIntoViewIfNeeded();
        await expect(reveal).toHaveCSS('opacity', '1');
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('.wish-launcher').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Sổ lời chúc chưa được kết nối.', { exact: false })).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await page.getByRole('button', { name: '💡 Gợi ý lời chúc' }).click();
    await page.locator('.wish-suggestions button').first().click();
    await expect(page.locator('#wish-message')).not.toBeEmpty();
    await page.locator('#wish-name').fill('Bạn thân');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.locator('.wish-launcher')).toBeFocused();
    await page.locator('.wish-launcher').click();
    await expect(page.locator('#wish-name')).toHaveValue('Bạn thân');
    if (width < 400) {
      await page.setViewportSize({ width, height: 420 });
      await page.locator('#wish-message').focus();
      await page.locator('button[type="submit"]').scrollIntoViewIfNeeded();
      await expect(page.locator('button[type="submit"]')).toBeInViewport();
      await page.setViewportSize({ width, height: 900 });
    }
    await page.getByRole('button', { name: 'Đóng lời chúc' }).click();
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/wedding-${width}.png`, fullPage: true });
  });
}
test('reveal waits for viewport and reduced motion reveals all without autoplay', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
    await page.locator('.envelope-seal').click();
    await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await expect(page.locator('#TimelineSection .story-item').first()).toHaveCSS('opacity', '0');
  const offsets = await page.locator('#TimelineSection .story-item').evaluateAll(items => items.map(item => new DOMMatrixReadOnly(getComputedStyle(item).transform).m41));
  expect(offsets[0]).toBeLessThan(0);
  expect(offsets[1]).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#TimelineSection .story-item').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('#TimelineSection .story-item').first()).toHaveCSS('transform', 'none');
  await page.locator('.photo-gallery').scrollIntoViewIfNeeded();
  await expect(page.locator('.gallery-thumbnails button').first()).toHaveAttribute('aria-current', 'true');
  await page.waitForTimeout(1500);
  await expect(page.locator('.gallery-thumbnails button').first()).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.hero-hearts')).toHaveCSS('display', 'none');
});


test('invitation doors open automatically and release page focus', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.invitation-page')).toHaveAttribute('inert', '');
  await expect(page.locator('.envelope-screen')).toHaveCount(0, { timeout: 6000 });
  await expect(page.locator('.invitation-page')).not.toHaveAttribute('inert');
  await expect(page.locator('.wedding-hero h1')).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('.persistent-seal')).toHaveCount(0);
});

test('seal moves in sync with the left door without moving down', async ({ page }) => {
  await page.goto('/');
  const seal = page.locator('.persistent-seal');
  await expect(seal).toBeFocused();
  const before = await seal.boundingBox();
  await page.keyboard.press('Enter');
  const samples = await page.evaluate(async () => {
    const door = document.querySelector('.door-left');
    const seal = document.querySelector('.persistent-seal');
    const values = [];
    const start = performance.now();
    await new Promise(resolve => {
      const sample = () => {
        const x = node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41;
        values.push({ door: x(door), seal: x(seal) });
        if (performance.now() - start < 1100) requestAnimationFrame(sample);
        else resolve();
      };
      sample();
    });
    return values;
  });
  expect(samples.at(-1).door).toBeLessThan(-10);
  expect(Math.max(...samples.map(sample => Math.abs(sample.door - sample.seal)))).toBeLessThan(1);
  const after = await seal.boundingBox();
  expect(after.x).toBeLessThan(before.x);
  expect(after.y).toBeCloseTo(before.y, 0);
  await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await expect(seal).toHaveCount(0);
});
for (const width of [360, 390, 768, 1440]) {
 test(`gallery selection, full photos and zoom at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  await expect(page.locator('.envelope-screen')).toHaveCount(0, { timeout: 6000 });
  await page.locator('.photo-gallery').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const thumbs = page.locator('.gallery-thumbnails button');
  await expect(page.locator('.gallery-current')).toHaveCSS('object-fit', 'contain');
  await expect(thumbs.nth(1)).toHaveAttribute('aria-current', 'true', { timeout: 8000 });
  await thumbs.nth(4).click();
  await expect(thumbs.nth(4)).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.gallery-current')).toHaveClass(/is-ready/);
  await page.locator('.gallery-main').click();
  await expect(page.locator('.fancybox__container')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.fancybox__container')).toHaveCount(0);
  await page.locator('.gallery-main').focus();
  await page.keyboard.press('ArrowRight');
  await expect(thumbs.nth(5)).toHaveAttribute('aria-current', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.photo-gallery').screenshot({ path: `test-results/gallery-${width}.png` });
 });
}
