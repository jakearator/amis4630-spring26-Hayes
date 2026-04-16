import { expect, test } from '@playwright/test';

test('happy path: register -> login -> browse -> cart -> checkout -> order history', async ({ page }) => {
  const uniqueEmail = `e2e-${Date.now()}@buckeye.test`;
  const password = 'ValidPass1';

  await page.goto('/register');

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password').first().fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole('heading', { name: 'Buckeye Marketplace' })).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(/\/products$/);
  const enabledAddToCart = page.locator('button:has-text("Add to Cart"):not([disabled])').first();
  await expect(enabledAddToCart).toBeVisible();
  await enabledAddToCart.click();

  await page.getByLabel('Shopping Cart').click();
  await expect(page).toHaveURL(/\/cart$/);

  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel('Enter full delivery address').fill('1739 N High St, Columbus, OH 43210');
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();

  await page.getByRole('button', { name: 'View Order History' }).click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();
  await expect(page.locator('body')).toContainText('BM-');
});