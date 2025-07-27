import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({ headless: false })

const page = await browser.newPage();

await page.goto('https://www.google.com/', { waitUntil: 'networkidle2' });