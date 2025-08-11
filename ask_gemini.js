require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lee el API key desde .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('No se encontró GEMINI_API_KEY en el archivo .env');
  process.exit(1);
}

// Lee el archivo children_text.json
const products = JSON.parse(fs.readFileSync('children_text.json', 'utf-8'));

// Prepara el prompt base con los textos de productos
const productosTexto = products.map(p => `Producto ${p.id}: ${p.text}`).join('\n\n');

// Función para preguntar a Gemini
async function preguntarGemini(pregunta) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
Tengo la siguiente lista de productos extraída de Amazon:
${productosTexto}

Pregunta del usuario: ${pregunta}
Responde de forma clara y concisa.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log('\nRespuesta de Gemini:\n');
  console.log(response.text());
}

// Interfaz para recibir la consulta desde terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('¿Qué deseas consultar sobre los productos? ', (pregunta) => {
  preguntarGemini(pregunta).then(() => rl.close());
});