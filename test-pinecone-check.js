const { Pinecone } = require("@pinecone-database/pinecone"); // Ensure correct import
require("dotenv").config({ path: ".env.local" });

const client = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY,
});

console.log("Pinecone Key:", process.env.PINECONE_API_KEY);

const indexName = "chat-ai"; // Existing index name

const checkIndex = async () => {
	try {
		// List all indexes
		const response = await client.listIndexes();
		const indexes = response.indexes.map((index) => index.name); // Extract the index names
		console.log("Available indexes:", indexes);

		// Check if the index exists
		const indexExists = indexes.includes(indexName);
		if (indexExists) {
			console.log(`Index ${indexName} exists and is connected.`);
		} else {
			console.log(`Index ${indexName} does not exist.`);
		}
	} catch (error) {
		console.error("Error checking index:", error);
	}
};

checkIndex();
