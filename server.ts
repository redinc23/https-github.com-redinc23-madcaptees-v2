import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;

// Lazy initialize Gemini client to prevent crashing on boot if the key is missing
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not configured. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Route: Generate Slogans
  app.post('/api/generate-slogans', async (req, res) => {
    const { theme, vibe, customTopics } = req.body;

    try {
      const ai = getGeminiClient();
      
      const prompt = `
        You are the master designer and chief copywriting troll at "Madcap Tees", an eccentric, highly artistic, quirky, and slightly cynical custom T-shirt label.
        Generate 4 highly creative, weird, funny, existential, retro, or geeky T-shirt design slogan configurations.
        
        Theme chosen by user: "${theme || 'Existential Dread'}"
        Vibe: "${vibe || 'Sarcastic & High IQ'}"
        Optional custom user-supplied topic/keywords: "${customTopics || 'Nothing specific'}"

        Each design will be printed on a t-shirt. For each of the 4 ideas, provide:
        1. A bold, prominent, short "Headline" (designed to be printed in large fonts across the chest). Max 5-7 words.
        2. A quirky "Subline" (smaller supporting text printed underneath). Max 12 words.
        3. A fitting "stickerEmoji" - a single emoji (like 🛸, 🫠, 💀, 🦖) that fits the theme perfectly to act as a graphic center.
        4. A humorous dry explanation of the design's "philosophy" or "irony" to show in the UI.

        Let your writing be genuinely funny, smart, and eccentric. Avoid bland cliches or generic marketing speak. Make sure each slogan represents maximum 'Madcap' energy!
      `;

      console.log('Calling Gemini with prompt:', prompt);

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: "A list of custom, weird T-shirt designs",
            items: {
              type: Type.OBJECT,
              properties: {
                headline: {
                  type: Type.STRING,
                  description: "Strong, catchy main text on the shirt, all caps preferred. Short."
                },
                subline: {
                  type: Type.STRING,
                  description: "Supporting witty explanation text on the shirt."
                },
                stickerEmoji: {
                  type: Type.STRING,
                  description: "A single representative emoji that complements the text."
                },
                explanation: {
                  type: Type.STRING,
                  description: "A funny and dry 1-sentence sales pitch of the design's philosophy."
                }
              },
              required: ['headline', 'subline', 'stickerEmoji', 'explanation']
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Emply response received from Gemini API.');
      }

      console.log('Received raw response from Gemini:', responseText);
      const parsedSlogans = JSON.parse(responseText.trim());
      res.json({ success: true, slogans: parsedSlogans });

    } catch (error: any) {
      console.error('Error in /api/generate-slogans:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'An error occurred while communicating with the AI. Please verify your GEMINI_API_KEY environment variable is configured.'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve static files / Vite asset builder
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting dev server with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Prerendering static files from dist folder...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Madcap Tees fully running on server port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
