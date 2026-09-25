import { test, expect } from '@playwright/test';

for (const width of [360, 390, 768, 1440]) {
  test(`layout and guest dialog at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
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
test('carousel uses dots and stays on the clicked photo after zoom closes', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wedding-carousel').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const dots = page.locator('.album-dots button');
  await expect(dots).toHaveCount(10);
  await expect(dots.first()).not.toHaveAttribute('aria-current', 'true', { timeout: 7000 });
  await dots.nth(3).click();
  await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  await page.locator('.album-slide:not([aria-hidden])').nth(3).click();
  await expect(page.locator('.fancybox__container')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.fancybox__container')).toHaveCount(0);
  await expect(page.locator('.play-toggle, .album-controls')).toHaveCount(0);
  await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(0, 0);
  await page.waitForTimeout(3800);
  await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  await dots.nth(8).click();
  await expect(dots.nth(8)).toHaveAttribute('aria-current', 'true');
});
test('reveal waits for viewport and reduced motion reveals all without autoplay', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#TimelineSection .story-item').first()).toHaveCSS('opacity', '0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#TimelineSection .story-item').first()).toHaveCSS('opacity', '1');
  await page.locator('.wedding-carousel').scrollIntoViewIfNeeded();
  await expect(page.locator('.album-dots button').first()).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.hero-hearts')).toHaveCSS('display', 'none');
});

test('album loops forward from last photo without a reverse scroll', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wedding-carousel').scrollIntoViewIfNeeded();
  const dots = page.locator('.album-dots button');
  await dots.last().click();
  await expect(dots.last()).toHaveAttribute('aria-current', 'true');
  await page.waitForTimeout(1000);
  await dots.last().blur();
  await page.mouse.move(0, 0);
  const samples = await page.locator('.album-track').evaluate(async track => {
    const positions = [];
    const start = performance.now();
    await new Promise(resolve => {
      const sample = () => {
        positions.push(new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
        if (performance.now() - start < 3100) requestAnimationFrame(sample);
        else resolve();
      };
      sample();
    });
    return positions;
  });
  const changes = samples.slice(1).map((value, i) => value - samples[i]);
  expect(changes.filter(delta => delta < -1).length).toBeGreaterThan(5);
  expect(changes.filter(delta => delta > 1000)).toHaveLength(1);
  expect(changes.filter(delta => delta > 1 && delta <= 1000)).toHaveLength(0);
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');
  await page.locator('.wedding-carousel').screenshot({ path: 'test-results/album-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.wedding-carousel').scrollIntoViewIfNeeded();
  await page.locator('.wedding-carousel').screenshot({ path: 'test-results/album-mobile.png' });
  const box = await page.locator('.album-viewport').boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const y = box.y + 160;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 280, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 130, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.fancybox__container')).toHaveCount(0);
  await cdp.detach();
});
