# Amazon Scrapper + Gemini AI

Este proyecto permite:
- Scrappear productos de Amazon desde una URL de búsqueda.
- Extraer los textos relevantes de cada producto.
- Consultar la información extraída usando la IA de Gemini de Google.

## Requisitos

- Node.js >= 18
- Python (solo si usas el microservicio de Gemini en Python)
- Una clave de API de Gemini (Google AI Studio)
- Navegador Chromium (Playwright lo descarga automáticamente)

## Instalación

1. Clona este repositorio y entra en la carpeta:

   ```sh
   git clone <url-del-repo>
   cd amazon-scrapper
   ```

2. Instala las dependencias de Node.js:

   ```sh
   npm install playwright @google/generative-ai dotenv
   ```

3. Instala Playwright (si es la primera vez):

   ```sh
   npx playwright install
   ```

4. Crea un archivo `.env` con tu clave de Gemini:

   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```

## Uso

### 1. Scrappear y extraer textos de productos

Ejecuta el flujo completo con un solo comando:

```sh
node scrape_and_extract.js "https://www.amazon.com/s?k=gpus"
```

Esto generará dos archivos:
- `raw.json`: información completa de cada producto.
- `children_text.json`: solo los textos relevantes de cada producto, con un id numérico.

### 2. Consultar los productos con Gemini

Lanza el chatbot en consola:

```sh
node ask_gemini.js
```

Escribe tu pregunta, por ejemplo:
```
¿Cuál es el producto más barato?
```
La IA de Gemini responderá usando la información de `children_text.json`.

---

## Archivos principales

- `scrape.js`: Scrapea Amazon y guarda la información en `raw.json`.
- `extract_children_text.js`: Extrae solo los textos de cada producto y los guarda en `children_text.json`.
- `scrape_and_extract.js`: Ejecuta ambos pasos anteriores con un solo comando.
- `ask_gemini.js`: Permite hacer preguntas a Gemini sobre los productos extraídos.
- `.env`: Guarda tu clave de API de Gemini.

---

## Notas

- Solo funciona con páginas de búsqueda de Amazon.
- Si Amazon cambia su estructura, puede que necesites actualizar los selectores en `scrape.js`.
- Tu clave de Gemini debe mantenerse privada y nunca subirse a repositorios públicos.

---

## Créditos

- Scraping: [Playwright](https://playwright.dev/)
- IA: [Gemini API](https://ai.google.dev/)