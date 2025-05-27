import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { FaSeedling, FaTractor } from "react-icons/fa";
import "./Chatbot.css";

const farmingBg =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"; // You can use your own image

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const response = await axios.post(`${API_URL}/api/chatbot/`, { question });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div
      className="chatbot-bg"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(34,139,34,0.7), rgba(255,255,255,0.7)), url(${farmingBg}) center/cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <div className="chatbot-card">
        <div className="chatbot-icon">
          <FaSeedling />
        </div>
        <h1 className="chatbot-title">Krishi AI Chatbot</h1>
        <p className="chatbot-desc">
          <FaTractor style={{ color: "#8FBC8F", marginRight: "0.5rem" }} />
          Ask me anything about farming, crops, or agriculture!
        </p>
        <form onSubmit={generateAnswer} style={{ width: "100%" }}>
          <textarea
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your farming question..."
            className="chatbot-textarea"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                generateAnswer(e);
              }
            }}
          ></textarea>
          <button
            type="submit"
            disabled={generatingAnswer || !question.trim()}
            className="chatbot-btn"
          >
            {generatingAnswer ? "Thinking..." : "Ask"}
          </button>
        </form>
        <div className="chatbot-answer">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
        <Link to="/" className="chatbot-back-btn">
          Go back
        </Link>
      </div>
    </div>
  );
}