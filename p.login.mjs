import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000/api';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        protocolTimeout: 120000,
        slowMo: 100
    });

    const pageTasks = [];

    for (let i = 0; i < 10; i++) {
        pageTasks.push((async () => {
            const page = await browser.newPage();

            await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
            await page.waitForSelector('.swagger-ui'); // Swagger ana container
            await new Promise(res => setTimeout(res, 3000)); // Fazladan bekleme

            // Gerekli endpointleri aç
            await page.click('#operations-Auth-AuthController_register button.opblock-summary-control');
            await page.click('#operations-Auth-AuthController_login button.opblock-summary-control');
            await page.click('#operations-Todo-TodoController_create button.opblock-summary-control');

            const user = {
                userName: `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
                password: '12345'
            };

            // REGISTER
            await page.waitForSelector('#operations-Auth-AuthController_register button.try-out__btn');
            await page.click('#operations-Auth-AuthController_register button.try-out__btn');
            await page.waitForSelector('#operations-Auth-AuthController_register textarea');
            await page.click('#operations-Auth-AuthController_register textarea');
            await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
            await page.keyboard.type(JSON.stringify(user, null, 2));
            await page.click('#operations-Auth-AuthController_register button.execute');
            console.log(`✅ [${user.userName}] Registered`);

            await new Promise(res => setTimeout(res, 1500));

            // LOGIN
            await page.waitForSelector('#operations-Auth-AuthController_login button.try-out__btn');
            await page.click('#operations-Auth-AuthController_login button.try-out__btn');
            await page.waitForSelector('#operations-Auth-AuthController_login textarea');
            await page.click('#operations-Auth-AuthController_login textarea');
            await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
            await page.keyboard.type(JSON.stringify(user, null, 2));
            await page.click('#operations-Auth-AuthController_login button.execute');
            await new Promise(res => setTimeout(res, 2000));

            const responseRaw = await page.$eval('#operations-Auth-AuthController_login .response .microlight', el => el.innerText);
            const parsed = JSON.parse(responseRaw);
            console.log(`🔐 [${user.userName}] Token Alındı`);

            // AUTHORIZE
            await page.click('.auth-wrapper .authorize');
            await page.waitForSelector('.modal-ux-content input[type="text"]');
            await page.click('.modal-ux-content input[type="text"]');
            await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
            await page.evaluate((token) => {
                window.ui.preauthorizeApiKey("bearer", token);
            }, parsed.token);

            const authButtons = await page.$$('.modal-ux-footer button');
            for (const btn of authButtons) {
                const text = await page.evaluate(el => el.innerText, btn);
                if (text.trim().toLowerCase() === 'authorize') {
                    await btn.click();
                    break;
                }
            }
            await page.click('.modal-ux-header .close-modal');

            // CREATE TODO
            await page.waitForSelector('#operations-Todo-TodoController_create button.try-out__btn');
            await page.click('#operations-Todo-TodoController_create button.try-out__btn');
            await page.waitForSelector('#operations-Todo-TodoController_create textarea');
            await page.click('#operations-Todo-TodoController_create textarea');
            await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
            await page.keyboard.type(`{
  "title": "Created by Puppeteer",
  "description": "Auto generated todo"
}`);
            await page.click('#operations-Todo-TodoController_create button.execute');
            await new Promise(res => setTimeout(res, 3000));

            console.log(`📝 [${user.userName}] Todo oluşturuldu`);
        })());
    }

    await Promise.all(pageTasks);
    await browser.close();
})();
