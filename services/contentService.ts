
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyAdventure = async (level: string): Promise<any> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Generate a simple daily English learning set for a ${level} student (Gujarati medium child, age 4-6).
    
    1. 3 simple English words (Flashcards) with Gujarati meaning, pronunciation, and an emoji.
    2. A very short 3-sentence story using these words. Provide English sentence and Gujarati translation.
    3. 2 simple multiple-choice questions based on the story.

    Return strictly valid JSON matching this schema.
  `;

  // We define the schema to ensure type safety in the response
  const schema = {
    type: Type.OBJECT,
    properties: {
      flashcards: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            gujarati: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            emoji: { type: Type.STRING },
          },
          required: ["word", "gujarati", "pronunciation", "emoji"],
        },
      },
      story: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            content: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        english: { type: Type.STRING },
                        gujarati: { type: Type.STRING }
                    }
                }
            }
        }
      },
      quiz: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER }
            }
        }
      }
    },
    required: ["flashcards", "story", "quiz"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to generate daily content:", error);
    // Fallback content in case API fails
    return {
      flashcards: [
        { word: "Cat", gujarati: "બિલાડી", pronunciation: "Ket", emoji: "🐱" },
        { word: "Milk", gujarati: "દૂધ", pronunciation: "Milk", emoji: "🥛" },
        { word: "Happy", gujarati: "ખુશ", pronunciation: "Hepi", emoji: "😊" }
      ],
      story: {
        title: "The Happy Cat",
        content: [
          { english: "The cat is happy.", gujarati: "બિલાડી ખુશ છે." },
          { english: "The cat drinks milk.", gujarati: "બિલાડી દૂધ પીવે છે." },
          { english: "It is a good day.", gujarati: "આ સારો દિવસ છે." }
        ]
      },
      quiz: [
        { question: "What does the cat drink?", options: ["Water", "Milk"], correctIndex: 1 },
        { question: "Is the cat happy?", options: ["Yes", "No"], correctIndex: 0 }
      ]
    };
  }
};