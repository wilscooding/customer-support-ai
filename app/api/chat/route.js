import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextEncoder } from "util";
import {
	BedrockRuntimeClient,
	InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt =
	"You are a helpful assistant. Answer questions concisely.";

export async function POST(req) {
	const data = await req.json();
	try {
		const prompt = data.map((msg) => msg.content).join("\nUser: ");
		let result;
		const provider = data[data.length - 1].provider;

		if (provider === "bedrock") {
			const command = new InvokeModelCommand({
				modelId: "anthropic.claude-instant-v1",
				body: JSON.stringify({
					prompt: `Human: ${prompt}\nAssistant:`,
					max_tokens_to_sample: 300,
				}),
			});

			const bedrockResponse = await bedrockClient.send(command);
			result = JSON.parse(
				new TextDecoder().decode(bedrockResponse.body)
			).completion;
		} else if (provider === "gemini") {
			const googleResult = await model.generateContent(
				`${systemPrompt}\nUser: ${prompt}`
			);
			const response = await googleResult.response;
			result = await response.text();
		}

		const stream = new ReadableStream({
			async start(controller) {
				try {
					controller.enqueue(new TextEncoder().encode(result));
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
