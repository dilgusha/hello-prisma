const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/api");

  // Swagger UI yüklenmesi için bekleme
  await page.waitForTimeout(3000);

  // "Try it out" butonuna tıklama
  await page.click('button[title="Try it out"]');

  // Bekle ki inputlar aktifleşsin
  await page.waitForTimeout(1000);

  // JSON body alanına yazı gir (örneğin textarea'yı bul ve içeriğini değiştir)
  await page.focus('textarea');
  await page.keyboard.type(`{
    "title": "Test Todo",
    "description": "Test açıklaması"
  }`);

  // Execute butonuna bas
  await page.click('button[title="Execute"]');

  // Sonucu görebilmek için biraz bekle
  await page.waitForTimeout(3000);

  // Swagger'da dönen yanıtı al
  const responseBody = await page.evaluate(() => {
    const response = document.querySelector(".responses-inner .microlight");
    return response ? response.innerText : null;
  });

  if (responseBody) {
    console.log("✅ Todo başarıyla eklendi:", responseBody);
  } else {
    console.log("❌ Todo ekleme başarısız: null");
  }

  await browser.close();
})();
