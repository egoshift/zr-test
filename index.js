const puppeteer = require('puppeteer');
const sites = require('./files/xxx.json');

(async () => {
  for (const site of sites) {
    const { browser, page } = await launchSite(site.url)
    const initialUrl = page.url()

    const selectIdentifierElement = 'input[type="text"],input[type="email"]'
    const selectPasswordElement = 'input[type="password"]'

    const passwordFields = await page.$(selectPasswordElement)

    const anyPasswordFieldExist = !!passwordFields
    const anyPasswordFieldVisible = !!passwordFields?.boundingBox()

    // any password fields that exists and visible
    const anyPasswordFieldAvailable = anyPasswordFieldExist && anyPasswordFieldVisible

    await page.waitForSelector(selectIdentifierElement)
    await page.type(selectIdentifierElement, site.user)

    // if no password input available then invoke keybord enter event
    if (!anyPasswordFieldAvailable) {
      await page.keyboard.press('Enter')
      await page.waitForSelector(selectPasswordElement)
    }

    await page.type(selectPasswordElement, site.pass)
    await page.keyboard.press('Enter');

    await page.waitForNavigation()

    if (initialUrl !== page.url()) {
      console.log('Detected url change')
      console.log({ currentUrl: page.url() })
    }

    await browser.close()
  }
})();

async function launchSite(site) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(site)

  console.log({ initialUrl: page.url() })

  return { browser, page }
}