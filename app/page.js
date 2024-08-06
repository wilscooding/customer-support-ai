"use client";

import {
	Box,
	Button,
	Stack,
	TextField,
	Typography,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: "Hi, I'm your personal AI assistant. How can I help you today?",
		},
	]);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const sendMessage = async () => {
		if (!message.trim() || isLoading) return;
		setIsLoading(true);

		setMessages((messages) => [
			...messages,
			{ role: "user", content: message },
			{ role: "assistant", content: "" },
		]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify([
					...messages,
					{ role: "user", content: message },
				]),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let result = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				result += decoder.decode(value, { stream: true });
				setMessages((messages) => {
					const lastMessage = messages[messages.length - 1];
					const otherMessages = messages.slice(0, -1);
					return [...otherMessages, { ...lastMessage, content: result }];
				});
			}
		} catch (error) {
			console.error("Error:", error);
			setMessages((messages) => [
				...messages,
				{
					role: "assistant",
					content:
						"I'm sorry, but I encountered an error. Please try again later.",
				},
			]);
		} finally {
			setIsLoading(false);
			setMessage("");
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: "#ffffff", // white background
				color: "#000000", // black text
			}}
		>
			<Stack
				direction="column"
				sx={{
					width: "100%",
					height: "100%",
					maxWidth: isMobile ? "100%" : "900px",
					margin: "0 auto",
					bgcolor: "#f5f5f5", // light grey background
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Stack
					direction="column"
					sx={{
						flexGrow: 1,
						overflow: "auto",
						p: 2,
					}}
				>
					{messages.map((message, index) => (
						<Box
							key={index}
							display="flex"
							justifyContent={
								message.role === "assistant" ? "flex-start" : "flex-end"
							}
							mb={1}
						>
							<Box
								sx={{
									bgcolor:
										message.role === "assistant"
											? "#ffffff" // white background for AI responses
											: "#e0e0e0", // light grey background for user messages
									color: "#000000", // black text
									borderRadius: 2,
									p: 2,
									maxWidth: "80%",
									wordBreak: "break-word",
								}}
							>
								{message.content}
							</Box>
						</Box>
					))}
					<div ref={messagesEndRef} />
				</Stack>
				<Stack
					direction="row"
					spacing={2}
					sx={{
						p: 2,
						borderTop: `1px solid ${theme.palette.divider}`,
						bgcolor: "#ffffff", // white background for input area
					}}
				>
					<TextField
						label="Message"
						fullWidth
						variant="outlined"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						disabled={isLoading}
						sx={{ backgroundColor: "#ffffff" }} // white background for input field
					/>
					<Button
						variant="contained"
						onClick={sendMessage}
						disabled={isLoading}
					>
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}
