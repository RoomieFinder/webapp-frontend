import { test, expect } from '@playwright/test';
import programmaticLogin from '../utils/programmaticLogin';

const EMAIL = process.env.PW_LANDLORD_EMAIL || 'user1@example.com';
const PASSWORD = process.env.PW_LANDLORD_PASSWORD || 'User123!';
const PROPERTY_ID = process.env.PW_PROPERTY_ID || '1'; // optional: provide pid to run full update test; defaults to '1' (mandate)
let GENERATED_PROPERTY_ID: string | undefined = undefined;
let setupContext: any = undefined;
let setupPage: any = undefined;

// helper to build cookie header from browser context
async function buildCookieHeaderFromContext(page: any) {
    const cookies = await page.context().cookies();
    return cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
}

test.beforeAll(async ({ browser }) => {
    // If user provided PROPERTY_ID, skip creating test property
    if (PROPERTY_ID) return;

    // create a fresh context / page for setup
    setupContext = await browser.newContext();
    setupPage = await setupContext.newPage();

    const page = setupPage;
    const context = setupContext;

    // ensure logged in and role selected (reuse programmatic login + role selection)
    try {
        await programmaticLogin(context.request, context, EMAIL, PASSWORD);
        await page.goto('/role');
        await page.click('text=Landlord');
        await page.click('button:has-text("Continue")');
        await page.waitForURL(/landlords/);
    } catch (err) {
        // fallback UI login
        await page.goto('/');
        const approveBtn = page.locator('text=Approve');
        if (await approveBtn.count() > 0) {
            await approveBtn.first().click({ timeout: 2000 }).catch(() => { });
            await approveBtn.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
        }
        await page.click('text=Get Started!');
        await page.fill('#email', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button:has-text("Login")');
        await page.waitForURL(/role/);
        await page.click('text=Landlord');
        await page.click('button:has-text("Continue")');
        await page.waitForURL(/landlords/);
    }

    // create a property via posting UI to ensure backend stores it (avoid multipart via API complexity)
    await page.goto('/landlords/posting');
    await page.fill('input[name="placeName"]', 'E2E Temp Property');
    await page.fill('input[name="caption"]', 'Temp caption for edit tests');
    await page.fill('input[name="type"]', 'Room');
    // attach fixture (use env override if provided)
    const fixture = process.env.PW_FIXTURE_PATH || 'D:\\ENG_3rd_Year\\SE\\project\\sunset.svg';
    await page.click('text=Drag & Drop or Click to Upload');
    await page.setInputFiles('#fileInput', fixture);
    // fill district/subdistrict with known DB values (if needed backend will accept)
    await page.fill('input[name="district"]', 'เขต พระนคร');
    await page.fill('input[name="subdistrict"]', 'พระบรมมหาราชวัง');
    await page.fill('input[name="price"]', '1000');
    await page.fill('input[name="roomSize"]', '12');
    await page.fill('input[name="capacity"]', '1');
    await page.fill('textarea[name="description"]', 'Temporary property created for edit tests');

    // submit and wait for POST
    const [res] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/property') && resp.request().method() === 'POST', { timeout: 30000 }),
        page.click('button:has-text("Create Post")'),
    ]);
    if (!res.ok()) throw new Error('Failed to create temp property for edit tests');

    // fetch landlord properties via API and find the created one by caption
    const cookieHeader = await buildCookieHeaderFromContext(page);
    const apiUrl = process.env.PW_API_URL || 'http://localhost:8080';
    const listRes = await context.request.get(`${apiUrl}/landlord/properties`, { headers: { cookie: cookieHeader } });
    if (listRes.ok()) {
        const json = await listRes.json();
        const props = json.properties || json || [];
        const found = props.find((p: any) => ((p.caption ?? p.Caption ?? '') as string).includes('Temp caption for edit tests') || ((p.placeName ?? p.PlaceName ?? p.place_name ?? '') as string).includes('E2E Temp Property'));
        if (found) GENERATED_PROPERTY_ID = String(found.id ?? found.ID ?? found.propertyId ?? found.PropertyID ?? found.property_id ?? found.PropertyId ?? found.property_id ?? found.id);
    }
});

test.afterAll(async () => {
    // clean up generated property
    const pid = GENERATED_PROPERTY_ID;
    if (!pid || !setupContext) return;
    const apiUrl = process.env.PW_API_URL || 'http://localhost:8080';
    try {
        await setupContext.request.delete(`${apiUrl}/property/${pid}`);
    } catch (_) {
        // ignore
    }
    try {
        await setupContext.close();
    } catch (_) { }
});

test.beforeEach(async ({ page, request }) => {
    try {
        await programmaticLogin(request, page.context(), EMAIL, PASSWORD);
        try {
            await page.goto('/role');
            await page.click('text=Landlord');
            await page.click('button:has-text("Continue")');
            await page.waitForURL(/landlords/);
            if (PROPERTY_ID) {
                await page.goto(`/landlords/edit?pid=${PROPERTY_ID}`);
                await page.waitForSelector('input[name="placeName"]', { timeout: 10000 }).catch(() => { });
            }
        } catch (e) { }
    } catch (err) {
        // fallback to UI login if API login fails
        try {
            await page.goto('/');
            const approveBtn = page.locator('text=Approve');
            if (await approveBtn.count() > 0) {
                await approveBtn.first().click({ timeout: 2000 }).catch(() => { });
                await approveBtn.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
            }
            await page.click('text=Get Started!');
            await page.fill('#email', EMAIL);
            await page.fill('input[type="password"]', PASSWORD);
            await page.click('button:has-text("Login")');
            await page.waitForURL(/role/);
            await page.click('text=Landlord');
            await page.click('button:has-text("Continue")');
            await page.waitForURL(/landlords/);
        } catch (e) {
            // ignore
        }
    }
});

test('US7-2 (validation): editing with incomplete data shows error', async ({ page }) => {
    if (!PROPERTY_ID) test.skip();
    await page.goto(`/landlords/edit?pid=${PROPERTY_ID}`);

    // wait until form loads (field placeName appears)
    await page.waitForSelector('input[name="placeName"]');

    // clear a required field
    await page.fill('input[name="placeName"]', '');

    await page.click('button:has-text("Save Changes")');

    // Robust validation check: accept native validation message, aria-invalid, or visible error text
    await page.waitForTimeout(300);
    const validationMessage = await page.$eval('input[name="placeName"]', el => (el as HTMLInputElement).validationMessage || '').catch(() => '');
    const ariaInvalid = await page.getAttribute('input[name="placeName"]', 'aria-invalid').catch(() => null);
    const visibleErrorCount = await page.locator('text=Please fill').count().catch(() => 0);
    expect(validationMessage.length > 0 || ariaInvalid === 'true' || visibleErrorCount > 0).toBeTruthy();
});

// Optional full edit success test if PROPERTY_ID provided and backend available
test('US7-2 (update): editing with complete data succeeds', async ({ page }) => {
    if (!PROPERTY_ID) test.skip();
    await page.goto(`/landlords/edit?pid=${PROPERTY_ID}`);
    await page.waitForSelector('input[name="placeName"]');
    // ensure the form finished loading values from backend
    await page.waitForLoadState('networkidle');
    // wait until placeName has a non-empty value (form hydrated)
    await page.waitForFunction(() => {
        const el = document.querySelector('input[name="placeName"]') as HTMLInputElement | null;
        return !!el && el.value.trim().length > 0;
    }, null, { timeout: 10000 });

    // change caption more slowly to avoid racing with any autosave or validation
    const captionLocator = page.locator('input[name="caption"]');
    await captionLocator.fill('');
    await captionLocator.type('Updated by E2E test', { delay: 60 });
    await page.waitForTimeout(500);

    // ensure the save button is enabled and network is idle before clicking
    const saveBtn = page.locator('button:has-text("Save Changes")');
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Click save and wait for the backend PUT to complete for this property, then assert success.
    const [res] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes(`/property/${PROPERTY_ID}`) && resp.request().method() === 'PUT', { timeout: 45000 }),
        saveBtn.click(),
    ]);

    if (!res.ok()) {
        const body = await res.text().catch(() => '<no body>');
        const req = res.request();
        const reqBody = req.postData() || '<no postData>';
        const reqHeaders = JSON.stringify(req.headers(), null, 2);
        const msg = `PUT /property/${PROPERTY_ID} failed: status=${res.status()}\n-- response body --\n${body}\n-- request headers --\n${reqHeaders}\n-- request body --\n${reqBody}`;
        throw new Error(msg);
    }

    await expect(page.locator('text=/Updated|Success/i')).toBeVisible({ timeout: 20000 });
});
