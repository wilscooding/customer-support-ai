// const { GoogleGenerativeAI } = require("@google/generative-ai");

// require("dotenv").config({ path: ".env.local" });

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// console.log("Google API Key:", process.env.GOOGLE_GEMINI_API_KEY );

// const testGoogleGenerativeAI = async () => {
// 	try {
// 		const googleResult = await model.generateContent("Hello, how are you?");
// 		const response = await googleResult.response;
// 		console.log("Google Generative AI response:", await response.text());
// 	} catch (error) {
// 		console.error("Error with Google Generative AI:", error);
// 	}
// };

// testGoogleGenerativeAI();
import { generateContent } from "./googleGenerativeAI";
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@google/generative-ai");

describe("Google Generative AI", () => {
	it("should generate content correctly", async () => {
		const mockResponse = {
			response: {
				text: async () => "Test response",
			},
		};
		GoogleGenerativeAI.mockImplementation(() => ({
			getGenerativeModel: jest.fn(() => ({
				generateContent: jest.fn(() => Promise.resolve(mockResponse)),
			})),
		}));

		const result = await generateContent("Test prompt");
		expect(result).toBe("Test response");
	});
});
