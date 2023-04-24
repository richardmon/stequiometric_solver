import puppeteer from 'puppeteer';
import fs from 'fs/promises';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250, // slow down by 250ms
  });
  const page = await browser.newPage();

  // Open Site
  await page.goto('https://ptable.com/?lang=es');

  // List elements
  const liElements = await page.$$('li[data-atomic]');

  // list of all elements
  const allChemicalElements = [];

  for (const li of liElements) {
    await li.click();
    const weightEl = (await page.$x('//section[@id="DataRegion"]//ul[@id="Property"]/li[4]/output'))[0];
    const weight = (await weightEl.evaluate(e => e.textContent)).replace(",", ".");

    const nameEl = (await page.$x('//figure[@id="CloseUp"]/output/em/a'))[0];
    const name = await nameEl.evaluate(e => e.textContent);

    const energyLevelEl = (await page.$x('//section[@id="DataRegion"]//ul[@id="Property"]/li[5]/output'))[0];
    const energyLevel = await energyLevelEl.evaluate(e => e.textContent);
    const energyLevelNumbers = energyLevel.split(/(,\s)|(?:y\s)/).map(Number).filter(Boolean);

    const abbreviationEl = (await page.$x('//figure[@id="CloseUp"]/output/abbr'))[0];
    const abbreviation = await abbreviationEl.evaluate(e => e.textContent);

    const numberEl = (await page.$x('//figure[@id="CloseUp"]/output/b'))[0];
    const number = await numberEl.evaluate(e => e.textContent);

    console.log('name', name);
    console.log('weight', weight);
    console.log('energyLevel', energyLevelNumbers);
    console.log('abbreviation', abbreviation);
    console.log('number', number);

    const chemicalElement = {
      name,
      weight,
      energyLevelNumbers,
      abbreviation,
      number
    }

    allChemicalElements.push(chemicalElement);
  }

  await fs.writeFile('./elements.json', JSON.stringify(allChemicalElements));


  await browser.close();
})();
