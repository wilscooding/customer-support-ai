import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextEncoder } from "util";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt =
	"You are a helpful assistant. Answer questions concisely.";

export async function POST(req) {
	const data = await req.json();
	console.log("Received request with data:", data);

	try {
		const prompt = `${systemPrompt}\nUser: ${data
			.map((msg) => msg.content)
			.join("\nUser: ")}`;
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = await response.text();

		const stream = new ReadableStream({
			async start(controller) {
				try {
					controller.enqueue(new TextEncoder().encode(text));
					controller.close();
				} catch (err) {
					controller.error(err);
				}
			},
		});

		return new NextResponse(stream);
	} catch (error) {
		console.error("Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
