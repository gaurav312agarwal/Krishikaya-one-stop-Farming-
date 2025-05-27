import "./LandingPage.css";
import header from "./assets/Project.jpg";
import intro from "./assets/farm.png";
import footer from "./assets/logo.png";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={header} alt="img"></img>
        <div className="heading">
          <h1>Krishi Kaya</h1>
          <p className="SubHeading">~ Essence of Farming</p>
        </div>
      </header>
      <div className="main-body">
        <div className="intro">
          <div className="img_intro">
            <img src={intro} alt="about"></img>
          </div>
          <div className="intro_cont">
            A comprehensive farmer assist app to streamline agricultural
            operations by predicting weather conditions, facilitating inventory
            management, providing access to a marketplace for buying/selling
            produce, and delivering updates on news and government schemes
            relevant to farmers.
            <br></br>
            Our vision is to revolutionize the agricultural landscape by
            bridging the gap between traditional farming practices and modern
            technological advancements.
            <br></br>
          </div>
        </div>
        <div className="movingtext">
          <div className="write">
            <span>
              Inventory Management -- Weather Forecasting -- Market Place -- AI
              ChatBot -- Plant Disease Detection --{" "}
            </span>
          </div>
          <div className="write marquee2">
            <span>
              Inventory Management -- Weather Forecasting -- Market Place -- AI
              ChatBot -- Plant Disease Detection --{" "}
            </span>
          </div>
        </div>
        <div className="features">
          <div className="f fe">
            <div className="co f_img2"></div>
            <div className="con">
              <h3>Market Place</h3>
              <p>
                Connect farmers directly with buyers and sellers.
              </p>
              <button className="but">
                <Link className="linkk" to="/equipment">
                  Visit
                </Link>
              </button>
            </div>
          </div>
          <div className="f">
            <div className="co f_img3"></div>
            <div className="con">
              <h3>AI ChatBot</h3>
              <p>
                AI assistant provides instant support and guidance
                for farmers.
              </p>
              <button className="but">
                <Link className="linkk" to="/chatbot">
                  ChatBot
                </Link>
              </button>
              
            </div>
          </div>

          <div className="f fe">
            <div className="co f_img4"></div>
            <div className="con">
              <h3>Weather Prediction</h3>
              <p>
                Accurate forecasts help farmers for informed decision-making.
              </p>
              <button className="but">
                <Link className="linkk" to="/weatherforecast">
                  Check
                </Link>
              </button>
            </div>
          </div>
          <div className="f">
            <div className="co f_img5"></div>
            <div className="con">
              <h3>Disease Detection</h3>
              <p>
                Empowering farmers with AI precision and detecting
                plant diseases.
              </p>
              <button className="but">
                <a href={`${API_URL}/api/disease/page/`} target="_blank" rel="noopener noreferrer">Check Here</a>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer"></div>

      <div className="footer_content" alt="footer">
        <div className="fconn">
          <h2>Contact Us:-</h2>
          <p>Phone No: +91-8306029616</p>
          <a href="mailto:gauravagarwal1694@gmail.com">EMAIL US</a>
        </div>
        <img src={footer} alt=""></img>
      </div>
    </div>
  );
}
