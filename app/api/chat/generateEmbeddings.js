import { loadModel } from "./loadModel";

let useModel;

export async function generateEmbeddings(texts) {
	try {
		if (!useModel) {
			useModel = await loadModel();
		}

		const embeddings = await useModel.embed(texts);

		const embeddingArray = embeddings.arraySync();

		return embeddingArray;
	} catch (error) {
		console.error("Error generating embeddings:", error);
		throw error;
	}
}
