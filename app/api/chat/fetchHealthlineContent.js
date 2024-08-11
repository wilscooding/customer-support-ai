import axios from "axios";
const cheerio = require("cheerio");

export async function fetchHealthlineContent(url) {
	try {
		const response = await axios.get(url);
		if (response.status !== 200) {
			throw new Error(`Failed to fetch. Status code: ${response.status}`);
		}
		const $ = cheerio.load(response.data);
		if (!$) {
			throw new Error("Failed to load cheerio.");
		}
		const paragraphs = $("p")
			.map((_, p) => $(p).text())
			.get();
		return paragraphs.join(" ");
	} catch (error) {
		console.error("Error scraping website:", error.message);
		return "";
	}
}
