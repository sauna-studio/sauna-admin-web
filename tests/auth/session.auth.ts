import { expect, test } from '@playwright/test';
// No staff enrollment endpoint exists until Workspace authorization is implemented.
test('staff login UI cannot register or claim management permission', async ({ page }) => {
	await page.goto('/auth');
	await expect(page.getByTestId('session-status')).toHaveText('ログインしていません。');
	await expect(page.getByRole('button', { name: 'Passkeyでログイン', exact: true })).toBeEnabled();
	await expect(page.getByRole('button', { name: 'Passkeyを登録', exact: true })).toHaveCount(0);
	await expect(
		page.getByText(
			'社員のGoogle Workspace所属確認と管理権限は未実装です。ログインしても管理操作は利用できません。'
		)
	).toBeVisible();
	const status = await page.evaluate(async () => {
		const r = await fetch('/auth/api/auth/passkeys/registration/options', { method: 'POST' });
		return r.status;
	});
	expect(status).toBe(404);
});
