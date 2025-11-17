import { APIRequestContext, BrowserContext } from '@playwright/test';

const BASE_API = process.env.PW_API_URL || 'http://localhost:8080';

export async function programmaticLogin(request: APIRequestContext, context: BrowserContext, email: string, password: string, timeoutMs = 5000) {
    // send request with a timeout guard to avoid hanging tests when backend is unreachable
    const reqPromise = request.post(`${BASE_API}/auth/login`, {
        data: { email, password },
        headers: { 'Content-Type': 'application/json' },
    });

    let res: any;
    try {
        res = await Promise.race([
            reqPromise,
            new Promise((_, rej) => setTimeout(() => rej(new Error('programmatic login timeout')), timeoutMs)),
        ]);
    } catch (err) {
        throw err;
    }

    if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);

    // try to extract set-cookie header(s) and set them in the browser context
    const sc = res.headers()['set-cookie'] || '';
    if (!sc) return; // nothing to set

    // simple parser: find name=value pairs (first occurrence per name)
    const re = /([^=;\s]+)=([^;\n\r]*)/g;
    const cookies: Record<string, string> = {};
    let m: RegExpExecArray | null;
    while ((m = re.exec(sc)) !== null) {
        const name = m[1];
        const value = m[2];
        if (!cookies[name]) cookies[name] = value;
    }

    const add = Object.entries(cookies).map(([name, value]) => ({
        name,
        value,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
    }));
    if (add.length > 0) await context.addCookies(add);
}

export default programmaticLogin;
