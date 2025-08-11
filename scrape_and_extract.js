const { execSync } = require('child_process');

const urlArg = process.argv[2];
if (!urlArg) {
  console.error('Debes pasar la URL de Amazon como argumento.\nEjemplo: node scrape_and_extract.js "https://www.amazon.com/s?k=gpus"');
  process.exit(1);
}

try {
  // Ejecuta el scraper
  execSync(`node scrape.js "${urlArg}"`, { stdio: 'inherit' });

  // Ejecuta la extracción de children_text
  execSync('node extract_children_text.js', { stdio: 'inherit' });

  console.log('Proceso completo. Revisa children_text.json');
} catch (err) {
  console.error('Error durante el proceso:', err);
}