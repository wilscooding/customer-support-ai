import {
	BedrockRuntimeClient,
	InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const bedrockClient = new BedrockRuntimeClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function invokeModel(prompt) {
	const command = new InvokeModelCommand({
		modelId: "anthropic.claude-instant-v1",
		body: JSON.stringify({
			prompt: `Human: ${prompt}\nAssistant:`,
			max_tokens_to_sample: 300,
		}),
	});

	const response = await bedrockClient.send(command);
	return JSON.parse(new TextDecoder().decode(response.body)).completion;
}
