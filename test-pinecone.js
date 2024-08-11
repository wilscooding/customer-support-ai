const { Pinecone } = require("@pinecone-database/pinecone"); // Adjust according to the actual import
require("dotenv").config({ path: ".env.local" });

const client = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY,
});

console.log("Pinecone Key", process.env.PINECONE_API_KEY);

const indexName = "chat-ai2";

const createIndex = async () => {
	try {
		const indexSpec = {
			name: indexName,
			dimension: 1536,
			metric: "cosine",
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
		};

		await client.createIndex(indexSpec);
		console.log(`Index ${indexName} created successfully.`);
	} catch (error) {
		console.error("Error creating index:", error);
	}
};

createIndex();
