import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000/api';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const runUserFlow = async (user) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Register
  await page.click('#operations-Auth-AuthController_register button.opblock-summary-control');
  await page.waitForSelector('#operations-Auth-AuthController_register button.try-out__btn');
  await page.click('#operations-Auth-AuthController_register button.try-out__btn');
  await page.waitForSelector('#operations-Auth-AuthController_register textarea');
  await page.click('#operations-Auth-AuthController_register textarea');
  await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(JSON.stringify(user, null, 2));
  await page.click('#operations-Auth-AuthController_register button.execute');
  console.log(`✅ [${user.userName}] Registered`);
  await delay(1500);

  // Login
  await page.click('#operations-Auth-AuthController_login button.opblock-summary-control');
  await page.waitForSelector('#operations-Auth-AuthController_login button.try-out__btn');
  await page.click('#operations-Auth-AuthController_login button.try-out__btn');
  await page.waitForSelector('#operations-Auth-AuthController_login textarea');
  await page.click('#operations-Auth-AuthController_login textarea');
  await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(JSON.stringify(user, null, 2));
  await page.click('#operations-Auth-AuthController_login button.execute');
  await delay(2000);
  const tokenJson = await page.$eval('#operations-Auth-AuthController_login .response .microlight', el => el.innerText);
  const { token } = JSON.parse(tokenJson);
  console.log(`🔐 [${user.userName}] Token Alındı`);

  // Authorize
  await page.click('.auth-wrapper .authorize');
  await page.waitForSelector('.modal-ux-content input[type="text"]');
  await page.evaluate((token) => {
    window.ui.preauthorizeApiKey("bearer", token);
  }, token);
  await delay(500);
  const buttons = await page.$$('.modal-ux-footer button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.toLowerCase().includes('authorize')) {
      await btn.click();
      break;
    }
  }
  await page.click('.modal-ux-header .close-modal');

  // Create Todo
  await page.click('#operations-Todo-TodoController_create button.opblock-summary-control');
  await page.waitForSelector('#operations-Todo-TodoController_create button.try-out__btn');
  await page.click('#operations-Todo-TodoController_create button.try-out__btn');
  await page.waitForSelector('#operations-Todo-TodoController_create textarea');
  await page.click('#operations-Todo-TodoController_create textarea');
  await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(JSON.stringify({
    title: "Created by Puppeteer",
    description: "Auto generated todo"
  }, null, 2));
  await page.click('#operations-Todo-TodoController_create button.execute');
  await delay(3000);
  console.log(`📝 [${user.userName}] Todo oluşturuldu`);

  await browser.close();
};

// 10 kullanıcıyı başlat
const tasks = [];
for (let i = 0; i < 10; i++) {
  const user = {
    userName: `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    password: '12345'
  };
  tasks.push(runUserFlow(user));
}

await Promise.all(tasks);
