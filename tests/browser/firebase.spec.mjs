import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
let env;
test.beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-quan-huong', firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') } });
});
test.afterAll(async () => { await env?.cleanup(); });
test.beforeEach(async () => { await env.clearFirestore(); });

test('send, persist, timestamp, avatar, trim validation and offline draft', async ({ page, context }) => {
  await page.goto('/');
    await page.locator('.envelope-seal').click();
    await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await page.locator('.wish-launcher').click();
  await expect(page.getByText('Hãy là người đầu tiên', { exact: false })).toBeVisible();
  await page.locator('#wish-name').fill('  ');
  await page.locator('#wish-message').fill('Chúc hạnh phúc');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('alert')).toContainText('Tên cần');
  await page.locator('#wish-name').fill('  Mai  ');
  const before = await page.locator('.wish-dialog').boundingBox();
  await page.locator('.wish-dialog').evaluate(dialog => {
    window.wishSizes = [];
    window.wishSizeObserver = new ResizeObserver(() => {
      const { width, height } = dialog.getBoundingClientRect();
      window.wishSizes.push({ width, height });
    });
    window.wishSizeObserver.observe(dialog);
  });
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Đã gửi lời chúc.', { exact: false })).toBeVisible();
  await expect(page.locator('.wish-item')).toHaveCount(1);
  await expect(page.locator('#wish-name')).toHaveValue('');
  await expect(page.locator('#wish-message')).toHaveValue('');
  const after = await page.locator('.wish-dialog').boundingBox();
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.height).toBeCloseTo(before.height, 0);
  const sizes = await page.evaluate(() => { window.wishSizeObserver.disconnect(); return window.wishSizes; });
  for (const size of sizes) {
    expect(size.width).toBeCloseTo(before.width, 0);
    expect(size.height).toBeCloseTo(before.height, 0);
  }
  await expect(page.locator('.wish-item h3')).toHaveText('Mai');
  await expect(page.locator('.avatar')).toHaveText('M');
  const color = await page.locator('.avatar').evaluate(el => el.style.backgroundColor);
  await expect(page.locator('.wish-item time')).not.toHaveText('Vừa gửi');
  await page.reload();
  await page.locator('.envelope-seal').click();
  await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await page.locator('.wish-launcher').click();
  await expect(page.locator('.wish-item')).toHaveCount(1);
  expect(await page.locator('.avatar').evaluate(el => el.style.backgroundColor)).toBe(color);
  await page.locator('#wish-name').fill('Bạn thân');
  await page.locator('#wish-message').fill('Nội dung giữ lại khi mất mạng');
  await context.setOffline(true);
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('alert')).toContainText('mất kết nối');
  await expect(page.locator('#wish-message')).toHaveValue('Nội dung giữ lại khi mất mạng');
  await expect(page.locator('#wish-name')).toHaveValue('Bạn thân');
  await context.setOffline(false);
});
test('load 50 then older wishes and preserve focus inside dialog', async ({ page }) => {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await Promise.all(Array.from({ length: 55 }, (_, i) => setDoc(doc(db, 'guest_book', `guest-${i}`), { guest_name: `Khách ${i}`, message: 'Chúc hạnh phúc!', avatar_color: '#a64e6b', create_date: Timestamp.fromMillis(1700000000000 + i * 1000) })));
  });
  await page.goto('/');
    await page.locator('.envelope-seal').click();
    await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await page.locator('.wish-launcher').click();
  await expect(page.locator('.wish-item')).toHaveCount(50);
  await expect(page.locator('.wish-item h3').first()).toHaveText('Khách 54');
  await page.getByRole('button', { name: 'Xem thêm' }).click();
  await expect(page.locator('.wish-item')).toHaveCount(55);
  await expect(page.getByRole('button', { name: 'Xem thêm' })).toHaveCount(0);
  await page.locator('button[type="submit"]').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Đóng lời chúc' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('button[type="submit"]')).toBeFocused();
});
test('mobile dialog keeps its size after sending and clears both fields', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 740 });
  await page.goto('/');
  await expect(page.locator('.envelope-screen')).toHaveCount(0, { timeout: 6000 });
  await page.locator('.wish-launcher').click();
  await page.locator('#wish-name').fill('Bạn thân');
  await page.locator('#wish-message').fill('Chúc hai bạn hạnh phúc!');
  const before = await page.locator('.wish-dialog').boundingBox();
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('#wish-name')).toHaveValue('');
  await expect(page.locator('#wish-message')).toHaveValue('');
  await expect(page.getByText('Đã gửi lời chúc.', { exact: false })).toBeVisible();
  const after = await page.locator('.wish-dialog').boundingBox();
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.height).toBeCloseTo(before.height, 0);
  await page.setViewportSize({ width: 390, height: 420 });
  await page.locator('button[type="submit"]').scrollIntoViewIfNeeded();
  await expect(page.locator('button[type="submit"]')).toBeInViewport();
});

test('permission denial keeps draft and permits retry', async ({ page }) => {
  await page.goto('/');
    await page.locator('.envelope-seal').click();
    await expect(page.locator('.envelope-screen')).toHaveCount(0);
  await page.locator('.wish-launcher').click();
  await expect(page.getByText('Hãy là người đầu tiên', { exact: false })).toBeVisible();
  const denied = await initializeTestEnvironment({ projectId: 'demo-quan-huong', firestore: { host: '127.0.0.1', port: 8080, rules: 'rules_version = "2"; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } } }' } });
  try {
    await page.locator('#wish-name').fill('Mai');
    await page.locator('#wish-message').fill('Chúc hai bạn hạnh phúc');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole('alert')).toContainText('Chưa gửi được');
    await expect(page.locator('#wish-message')).toHaveValue('Chúc hai bạn hạnh phúc');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  } finally { await denied.cleanup(); }
});
