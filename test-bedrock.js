const {
	BedrockRuntimeClient,
	InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

require("dotenv").config({ path: ".env.local" });

const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

console.log("AWS Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS Secret Access Key:", process.env.AWS_SECRET_ACCESS_KEY);

const testBedrock = async () => {
	try {
		const command = new InvokeModelCommand({
			modelId: "anthropic.claude-instant-v1",
			body: JSON.stringify({
				prompt: "Human: Hello, how are you?\nAssistant:",
				max_tokens_to_sample: 50,
			}),
		});

		const response = await bedrockClient.send(command);
		console.log(
			"Bedrock response:",
			JSON.parse(new TextDecoder().decode(response.body))
		);
	} catch (error) {
		console.error("Error with Bedrock:", error);
	}
};

testBedrock();
