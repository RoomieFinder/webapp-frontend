import path from 'path';
import { test, expect } from '@playwright/test';
import programmaticLogin from '../utils/programmaticLogin';

const EMAIL = process.env.PW_LANDLORD_EMAIL || 'user1@example.com';
const PASSWORD = process.env.PW_LANDLORD_PASSWORD || 'User123!';

test.beforeEach(async ({ page, request }) => {
    // perform programmatic login (sets cookies in browser context)
    try {
        await programmaticLogin(request, page.context(), EMAIL, PASSWORD);
        // after programmatic login, select role explicitly
        try {
            await page.goto('/role');
            await page.click('text=Landlord');
            await page.click('button:has-text("Continue")');
            await page.waitForURL(/landlords/);
        } catch (e) {
            // ignore selection errors — fallback UI will handle if needed
        }
    } catch (err) {
        // fallback: try dismissing cookie and do UI login if programmatic fails
        const approveBtn = page.locator('text=Approve');
        try {
            await page.goto('/');
            if (await approveBtn.count() > 0) {
                await approveBtn.first().click({ timeout: 2000 }).catch(() => { });
                await approveBtn.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
            }
            await page.click('text=Get Started!');
            await page.fill('#email', EMAIL);
            await page.fill('input[type="password"]', PASSWORD);
            await page.click('button:has-text("Login")');
            await page.waitForURL(/role/);
            // select landlord role
            await page.click('text=Landlord');
            await page.click('button:has-text("Continue")');
            await page.waitForURL(/landlords/);
        } catch (e) {
            // ignore — tests will fail later if login not possible
        }
    }
});

test('US7-1: landlord can create a property with complete data', async ({ page }) => {
    await page.goto('/landlords/posting');

    await page.fill('input[name="placeName"]', 'E2E Test Place');
    await page.fill('input[name="caption"]', 'Nice place for testing');
    await page.fill('input[name="type"]', 'Room');

    // click upload area and attach an image file. Use `PW_FIXTURE_PATH` if provided,
    // otherwise default to the user's device path (as requested).
    await page.click('text=Drag & Drop or Click to Upload');
    const fixture = process.env.PW_FIXTURE_PATH || 'D:\\ENG_3rd_Year\\SE\\project\\sunset.svg';
    await page.setInputFiles('#fileInput', path.resolve(fixture));

    // use district/subdistrict values that exist in the DB
    await page.fill('input[name="district"]', 'เขต พระนคร');
    await page.fill('input[name="subdistrict"]', 'พระบรมมหาราชวัง');
    await page.fill('input[name="price"]', '5000');
    await page.fill('input[name="roomSize"]', '20');
    await page.fill('input[name="capacity"]', '2');
    await page.fill('textarea[name="description"]', 'A description for testing');

    // Click create and wait for the backend POST response to /property, then assert success.
    const [res] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/property') && resp.request().method() === 'POST', { timeout: 30000 }),
        page.click('button:has-text("Create Post")'),
    ]);

    // ensure server returned OK
    expect(res.ok()).toBeTruthy();

    // then assert a visible success message (give generous timeout)
    const msg = page.locator('text=/Created|Success|Updated/i');
    await expect(msg).toBeVisible({ timeout: 20000 });
});

test('US7-1: landlord cannot create property with incomplete data', async ({ page }) => {
    await page.goto('/landlords/posting');

    // leave placeName empty to trigger client-side validation
    await page.fill('input[name="caption"]', 'Missing place name');
    await page.fill('input[name="type"]', 'Room');
    // no photos
    await page.fill('input[name="district"]', '');
    await page.fill('input[name="subdistrict"]', '');
    await page.fill('input[name="price"]', '');
    await page.fill('input[name="roomSize"]', '');
    await page.fill('input[name="capacity"]', '');
    await page.fill('textarea[name="description"]', '');

    await page.click('button:has-text("Create Post")');

    // should show client-side validation message
    await expect(page.locator('text=Please fill')).toBeVisible();
});
