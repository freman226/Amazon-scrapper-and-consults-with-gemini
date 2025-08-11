const fs = require('fs');

// Lee el archivo raw.json
const data = JSON.parse(fs.readFileSync('raw.json', 'utf-8'));

// Extrae solo el texto principal de cada producto y le asigna un id numérico
const childrenTexts = data.map((item, idx) => {
  // Toma el primer valor de children_text (el texto principal)
  const text = item.children_text ? Object.values(item.children_text)[0] : '';
  return { id: idx + 1, text };
});

// Guarda el resultado en un nuevo archivo
fs.writeFileSync('children_text.json', JSON.stringify(childrenTexts, null, 2), 'utf-8');

console.log('Listo. Información guardada en children_text.json');