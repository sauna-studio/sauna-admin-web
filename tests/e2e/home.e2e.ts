import { expect, test } from '@playwright/test';

test('staff shell links to login without exposing management data', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('施設を支える、ひとつの場所。');
	await expect(page.getByRole('link', { name: 'Passkeyでログイン', exact: true })).toHaveAttribute(
		'href',
		'/auth'
	);
	await expect(
		page.getByText(
			'スタッフ用画面は現在準備中です。このページには予約・顧客・シフトのデータは表示されず、管理操作もできません。'
		)
	).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
	expect(errors).toEqual([]);
});

test('Vintage and Pumpkin themes switch', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.app-shell')).toHaveCSS('background-color', 'rgb(230, 226, 218)');
	await page.getByRole('button', { name: 'ダークテーマに切り替え' }).click();
	await expect(page.locator('.app-shell')).toHaveCSS('background-color', 'rgb(41, 46, 51)');
});

test('management routes do not exist yet', async ({ request }) => {
	for (const path of ['/reservations', '/facilities', '/staff']) {
		const response = await request.get(path);
		expect(response.status()).toBe(404);
	}
});
