const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/api', { waitUntil: 'networkidle0' });

    const section = '#operations-Auth-AuthController_register';

    // ilk dəfə try-out
    await page.click(`${section} button.opblock-summary-control`);
    await page.waitForSelector(`${section} button.try-out__btn`);
    await page.click(`${section} button.try-out__btn`);
    await page.waitForSelector(`${section} textarea`);

    for (let i = 0; i < 10; i++) {
        const user = {
            userName: `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            password: '12345'
        };

        // textarea'ya yeni user yaz
        await page.click(`${section} textarea`);
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(JSON.stringify(user, null, 2));

        // Göndər
        await page.click(`${section} button.execute`);
        await page.waitForSelector(`${section} .response`);
        console.log(`✅ Registered: ${user.userName}`);

        // "Clear" düyməsini tap və bas
        const buttons = await page.$$(`${section} button`);
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText.toLowerCase(), btn);
            if (text.includes('clear')) {
                await btn.click();
                break;
            }
        }

        await new Promise(r => setTimeout(r, 1000));
    }


    await browser.close();
})();
