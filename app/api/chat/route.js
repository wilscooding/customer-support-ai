import { NextResponse } from "next/server";
import { fetchHealthlineContent } from "./fetchHealthlineContent";
import { generateEmbeddings } from "./generateEmbeddings";
import { pinecone, indexName } from "./pineconeClient";
import { invokeModel } from "./bedrockClient";
import { generateContent } from "./googleGenerativeAI";
import { TextEncoder } from "util";

export async function POST(req) {
	try {
		const data = await req.json();
		const prompt = data.map((msg) => msg.content).join("\nUser: ");
		const provider = data[data.length - 1].provider;

		const healthlineURL = "https://www.healthline.com/nutrition";
		const textData = await fetchHealthlineContent(healthlineURL);

		if (!textData) {
			throw new Error("Failed to fetch content from Healthline.");
		}

		const embeddings = await generateEmbeddings([textData]);

		const vectors = [
			{
				id: `doc-0`,
				values: embeddings[0],
				metadata: { text: textData },
			},
		];

		await pinecone.index(indexName).upsert(vectors);

		const promptEmbedding = (await generateEmbeddings([prompt]))[0];

		const queryResponse = await pinecone.index(indexName).query({
			vector: promptEmbedding,
			topK: 3,
			includeMetadata: true,
		});


		const concatenatedText = queryResponse.matches
			.map((match) => match.metadata.text)
			.join(" ");

		let result;

		if (provider === "bedrock") {
			result = await invokeModel(prompt);
		} else if (provider === "gemini") {
			result = await generateContent(prompt);
		} else {
			throw new Error("Invalid provider.");
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

