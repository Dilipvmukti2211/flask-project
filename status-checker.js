// status-checker.js
const puppeteer = require('puppeteer');
const fs = require('fs');

const URLS = [
  'https://pro.ambicam.com/vmukti/index-pro.html',
  'https://pro.ambicam.com/vmukti/index-exam1.html',
  'https://pro.ambicam.com/vmukti/index-exam2.html',
  'https://pro.ambicam.com/vmukti/index-exam3.html',
  'https://pro.ambicam.com/vmukti/index-exam4.html',
  'https://pro.ambicam.com/vmukti/index-exam5.html',
  'https://pro.ambicam.com/vmukti/index-exam6.html',
  'https://pro.ambicam.com/vmukti/index-exam7.html',
  'https://pro.ambicam.com/vmukti/index-exam8.html',
  'https://pro.ambicam.com/vmukti/index-exam9.html',
  'https://pro.ambicam.com/vmukti/index-exam10.html',
  'https://pro.ambicam.com/vmukti/index-exam11.html',
  'https://pro.ambicam.com/vmukti/index-exam12.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam1.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam2.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam3.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam4.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam5.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam6.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam7.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam8.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam9.html',
  'https://vsplpro.ambicam.com/vmukti/index-exam10.html'
];

const AUTH = {
  username: 'adminatvmukti',
  password: 'alpha@admin#vmukti',
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkConnectionStatus(url, browser) {
  const page = await browser.newPage();
  try {
    await page.authenticate(AUTH);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForSelector('button', { visible: true, timeout: 10000 });

    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const connectBtn = buttons.find(btn => btn.innerText.toLowerCase().includes('connect'));
      if (connectBtn) {
        connectBtn.click();
        return true;
      }
      return false;
    });

    if (!clicked) throw new Error('Connect button not found');

    await delay(2000);

    const isConnected = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(
        btn => btn.innerText.trim().toLowerCase() === 'disconnect'
      );
    });

    return { url, status: isConnected ? 'ONLINE' : 'OFFLINE' };
  } catch (err) {
    return { url, status: 'OFFLINE', error: err.message };
  } finally {
    await page.close();
  }
}

async function runChecks() {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  try {
    for (const url of URLS) {
      const result = await checkConnectionStatus(url, browser);
      results.push(result);
    }

    fs.writeFileSync('./status.json', JSON.stringify(results, null, 2));
    console.log(`[${new Date().toLocaleTimeString()}] Status updated.`);
  } catch (err) {
    console.error('Error during status check:', err.message);
  } finally {
    await browser.close();
  }
}

runChecks(); // Initial run
setInterval(runChecks,   60 * 1000); // Every 5 mins

