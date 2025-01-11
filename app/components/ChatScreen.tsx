"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import { FaArrowUpLong } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API key and model initialization
const geminiApi = process.env.NEXT_PUBLIC_GEMINI_APIKEY || "";
const genAI = new GoogleGenerativeAI(geminiApi);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Types for message structure
interface Message {
  content: string;
  sender: string; 
  id: number;
}

// Props for the InputSection component
interface InputSectionProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: FormEvent) => void;
  loading: boolean;
}

const ChatScreen: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(""); // Message input state
  const [messages, setMessages] = useState<Message[]>([]); // Messages state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for message generation
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the end of messages

  // Function to format the message content dynamically
  const formatMessageContent = (content: string) => {
    // Format headings (e.g., ## Heading)
    content = content.replace(/^##\s(.*)$/gm, '<h2 class="font-bold text-xl">$1</h2>');
    // Format bold text (e.g., **bold**)
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    // Format code blocks (e.g., ```code block```)
    content = content.replace(/```(.*?)```/gs, '<pre class="bg-darkAccent text-white p-2 rounded">$1</pre>');
    // Format line breaks for readability
    content = content.replace(/\n/g, '<br/>');
    return content;
  };

  // Generates the user and system messages
  const msgGeneration = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      content: prompt,
      sender: "us",
      id: generateMessageId(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");

    try {
      // Generate the system message asynchronously
      const result = await model.generateContent(prompt);
      const systemMessage: Message = {
        content: formatMessageContent(result.response.text()), // Apply formatting here
        sender: "system",
        id: generateMessageId(),
      };

      // Add the system message after the response is received
      setMessages((prev) => [...prev, systemMessage].filter(chat => chat.sender !== "error"));
    } catch (error) {
      console.error("Error during message generation:", error);
      const systemError: Message = {
        content: "Error in generation, please try again.",
        sender: "error",
        id: generateMessageId(),
      };

      // Add the system error message
      setMessages((prev) => [...prev, systemError]);
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique message ID
  const generateMessageId = (): number => Math.floor(Math.random() * 100000);

  // Handle sending a message
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    msgGeneration();
  };

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-full h-full max-w-[800px] flex flex-col bg-primaryBg relative">
      <div className="flex-1 overflow-y-auto p-4 mb-[100px] mt-[60px]">
        {/* Display Messages */}
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.sender === "us"
                  ? "bg-darkAccent text-darkText self-end"
                  : message.sender === "system"
                  ? "bg-lightblue text-primaryText"
                  : "bg-red-600 text-white self-center" // Error message styling
              }`}
              dangerouslySetInnerHTML={{ __html: message.content }} // Render formatted HTML content
            />
          ))}
          {loading && (
            <div className="p-3 rounded-lg bg-lightblue text-primaryText self-center">
              System is typing...
            </div>
          )}
        </div>
        {/* This div will help with auto-scrolling to the latest message */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <InputSection
        prompt={prompt}
        setPrompt={setPrompt}
        handleSendMessage={handleSendMessage}
        loading={loading}
      />
    </div>
  );
};

// InputSection component with textarea
const InputSection: React.FC<InputSectionProps> = ({ prompt, setPrompt, handleSendMessage, loading }) => {
  return (
    <form
      onSubmit={handleSendMessage}
      className="w-full bg-softGrey rounded-2xl min-h-[80px] max-h-[160px] px-4 py-3 flex items-center justify-between absolute bottom-0 left-1/2 transform -translate-x-1/2 max-w-[760px]"
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full outline-none border-none overflow-y-auto scrollbar-hide resize-none bg-softGrey text-primaryText"
        placeholder="Type your message..."
        rows={3}
      />
      <button
        type="submit"
        className="bg-darkgrey text-offwhite px-4 py-2 rounded-full hover:bg-mediumgrey disabled:opacity-50"
        disabled={!prompt.trim() || loading} // Disable button if input is empty or loading
      >
        <FaArrowUpLong />
      </button>
    </form>
  );
};

export default ChatScreen;
