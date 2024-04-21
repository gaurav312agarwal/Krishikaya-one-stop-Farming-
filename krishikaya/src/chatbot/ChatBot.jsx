import React ,{useState} from 'react'
import axios from "axios"
import ReactMarkdown from "react-markdown"
import './Chatbot.css'
import { Link } from 'react-router-dom'
export default function ChatBot() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [generatingAnswer, setGeneratingAnswer] = useState(false);
  
    async function generateAnswer(e) {
      setGeneratingAnswer(true);
      e.preventDefault();
      setAnswer("Loading your answer... \n It might take upto 10 seconds");
      try {
        const response = await axios({
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCDmQNLkHfF-PHmiFa0In9qCGaUW6asWKk",
          method: "post",
          data: {
            contents: [{ parts: [{ text: question }] }],
          },
        });
  
        setAnswer(
          response["data"]["candidates"][0]["content"]["parts"][0]["text"]
        );
      } catch (error) {
        console.log(error);
        setAnswer("Sorry - Something went wrong. Please try again!");
      }
  
      setGeneratingAnswer(false);
    }
  
    return (
      <>
        <div>
          <form
            onSubmit={generateAnswer}
            className="chatcontainer"
          >
            <a href="#" target="_blank">
              <h1><b>Chat AI</b></h1>
            </a>
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything"
            ></textarea>
            <button type="submit" disabled={generatingAnswer} className='subBtn'> <b>Generate answer </b></button>
          </form>
          <button className='backBtn'><Link to="/" className='btnn'><b>Go back</b></Link></button>

          <div className="answer">
            <ReactMarkdown className="p-3">{answer}</ReactMarkdown>
          </div>
        </div>
      </>
    );
}
