// scrape.js
const { chromium } = require('playwright');
const fs = require('fs');

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    locale: 'es-ES',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari'
  });
  const page = await context.newPage();

  const urlArg = process.argv[2];
  if (!urlArg) {
    console.error('Debes pasar la URL de Amazon como argumento.\nEjemplo: node scrape.js "https://www.amazon.com/s?k=gpus"');
    process.exit(1);
  }
  const URL = urlArg;
  let results = [];

  console.log('Navegando:', URL);
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Aceptar cookies si aparece (UE)
    try { await page.getByRole('button', { name: /Aceptar|Accept|Aceptar todas las cookies|Allow all cookies/i }).click({ timeout: 3000 }); } catch {}

    await page.waitForSelector('div.s-main-slot');

    // Extrae toda la información posible de cada tarjeta de producto
    const pageItems = await page.$$eval('div.s-main-slot > div[data-component-type="s-search-result"]', cards =>
      cards.map(card => {
        // Evita patrocinados
        const sponsoredBadge = card.querySelector('span[data-component-type="s-status-badge-component"]');
        const badgeText = Array.from(card.querySelectorAll('span')).some(span =>
          /Sponsored|Patrocinado/i.test(span.textContent)
        );
        if (sponsoredBadge || badgeText) return null;

        // Todos los atributos del div principal
        const attrs = {};
        for (const attr of card.attributes) {
          attrs[attr.name] = attr.value;
        }

        // Textos de los hijos directos (nivel 1)
        const children_text = {};
        Array.from(card.children).forEach(child => {
          if (child.tagName && child.textContent) {
            children_text[child.tagName.toLowerCase() + (child.className ? '.' + child.className.replace(/\s+/g, '.') : '')] = child.textContent.trim();
          }
        });

        // HTML completo de la tarjeta
        const raw_html = card.outerHTML;

        return {
          attrs,
          children_text,
          raw_html
        };
      }).filter(Boolean)
    );

    results.push(...pageItems);

    await sleep(1500 + Math.random()*1000);
  } catch (err) {
    console.error(`Error en la página:`, err);
  }

  await browser.close();

  // Guarda JSON bruto
  fs.writeFileSync('raw.json', JSON.stringify(results, null, 2), 'utf-8');

  console.log(`Listo. ${results.length} items → raw.json`);
})();
