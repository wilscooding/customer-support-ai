const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs"); 

const loadModel = async () => {
	try {
		const model = await use.load();
		console.log("USE model loaded successfully");
	} catch (error) {
		console.error("Error loading USE model:", error);
	}
};

loadModel();
