import puppeteer from 'puppeteer';

let parsed;
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/api', { waitUntil: 'networkidle0' });

    // Login işlemi
    await page.waitForSelector('#operations-Auth-AuthController_login');
    await page.click('#operations-Auth-AuthController_login button.opblock-summary-control');
    await page.waitForSelector('#operations-Auth-AuthController_login button.try-out__btn');
    await page.click('#operations-Auth-AuthController_login button.try-out__btn');

    const loginTextarea = '#operations-Auth-AuthController_login textarea';
    await page.click(loginTextarea);
    await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(`{
  "userName": "dilgusha",
  "password": "12345"
}`);
    await page.click('#operations-Auth-AuthController_login button.execute');
    await new Promise(resolve => setTimeout(resolve, 4000));

    const responseRaw = await page.$eval(
        '#operations-Auth-AuthController_login .response .microlight',
        el => el.innerText
    );

    parsed = JSON.parse(responseRaw);
    console.log('\n✅ Token:', parsed.token);

    // Swagger UI'ye token'ı doğrudan inject et
    // await page.evaluate((token) => {
    //     window.ui.preauthorizeApiKey("bearer", `Bearer ${token}`);
    // }, parsed.token);

    await page.evaluate((token) => {
        // SADECE token yaz (Bearer ekleme)
        window.ui.preauthorizeApiKey("bearer", token);
    }, parsed.token);


    // TODO oluştur
    await page.waitForSelector('#operations-Todo-TodoController_create');
    await page.click('#operations-Todo-TodoController_create button.opblock-summary-control');
    await page.waitForSelector('#operations-Todo-TodoController_create button.try-out__btn');
    await page.click('#operations-Todo-TodoController_create button.try-out__btn');

    const todoTextarea = '#operations-Todo-TodoController_create textarea';
    await page.click(todoTextarea);
    await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(`{
  "title": "Puppeteer test todosu",
  "description": "Bu todo Swagger üstünden otomatik oluşturuldu"
}`);

    await page.click('#operations-Todo-TodoController_create button.execute');
    await new Promise(resolve => setTimeout(resolve, 4000));

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `upload/todo-${date}.png`, fullPage: true });
    console.log('✅ Screenshot alındı: todo-result.png');

    try {
        parsed = JSON.parse(responseRaw);
        console.log('\n✅ Token:', parsed.token);

        // ✅ JSON'u dosyaya yaz
        const fs = require('fs');
        fs.writeFileSync('upload/login-response.json', responseRaw, 'utf8');
        console.log('✅ login-response.json dosyaya kaydedildi.');

    } catch (err) {
        console.error('❌ JSON parse hatası:', err);
    }



})();
