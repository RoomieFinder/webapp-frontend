import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/playwright',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !!process.env.PW_REUSE_SERVER,
        timeout: 120_000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
