const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs"); // Ensure you're using the Node.js backend

const loadModel = async () => {
	try {
		const model = await use.load();
		console.log("USE model loaded successfully");
		return model;
	} catch (error) {
		console.error("Error loading USE model:", error);
		return null;
	}
};

const generateEmbeddings = async (textArray, model) => {
	if (!model) {
		throw new Error("USE model is not loaded.");
	}
	try {
		const embeddings = await model.embed(textArray);
		const embeddingsArray = embeddings.arraySync();
		console.log("Generated embeddings:", embeddingsArray);
		return embeddingsArray;
	} catch (error) {
		console.error("Error generating embeddings:", error);
	}
};

const test = async () => {
	const model = await loadModel();
	if (model) {
		await generateEmbeddings(["Hello, world!"], model);
	}
};

test();
