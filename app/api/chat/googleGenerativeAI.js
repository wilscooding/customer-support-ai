import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt =
	"You are a helpful assistant. Answer questions concisely.";

export async function generateContent(prompt) {
	const googleResult = await model.generateContent(
		`${systemPrompt}\nUser: ${prompt}`
	);
	const response = await googleResult.response;
	return await response.text();
}
