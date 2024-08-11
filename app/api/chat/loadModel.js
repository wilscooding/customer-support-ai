const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs");

let useModel = null;

let modelLoadingPromise = null;

export async function loadModel() {
	if (!useModel && !modelLoadingPromise) {
		modelLoadingPromise = use
			.load()
			.then((model) => {
				useModel = model;
				modelLoadingPromise = null; // Reset the promise after loading
				return useModel;
			})
			.catch((error) => {
				console.error("Error loading the model:", error);
				modelLoadingPromise = null; // Reset the promise on error
				throw error;
			});
		return modelLoadingPromise;
	} else if (modelLoadingPromise) {
		return modelLoadingPromise; // Return the ongoing loading promise
	} else {
		return useModel; // Return the already loaded model
	}
}
