import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [url, setUrl] = useState("");
  const [imageState, setImageState] = useState("");
  const [timeSize, setTimeSize] = useState({ time: "", size: "" });
  const [imgUrl, setImgUrl] = useState("");

  const generateImg = async (e) => {
    e.preventDefault();
    try {
      setImageState("loading"); // Set image state to loading when request is made
      const response = await axios.post("https://neonflake-umber.vercel.app/api/v1/generate", {
        url: url,
      });
      setTimeSize({
        ...timeSize,
        time: response.data.time,
        size: response.data.size,
      });
      setImgUrl(response.data.url);
      //just to show url thats all
      console.log(response.data.url);
      setImageState("loaded"); // Set image state to loaded when request is successful
    } catch (error) {
      console.error("Error generating image:", error);

      setImageState("error"); // Set image state to error if request fails
    }
  };

  let displayContent;
  if (imageState === "") {
    displayContent = (
      <div className="loading-style">
        <img className="start-img" src="/searchImg.png" alt="search" />
        <h4>Explore the Websites !!!</h4>
      </div>
    );
  } else if (imageState === "loading") {
    displayContent = (
      <div className="loading-style">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#8a2be2"
          secondaryColor="#7637b1"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <h4>Generating Image please wait</h4>
      </div>
    );
  } else if (imageState === "loaded") {
    // Render the image or whatever content you want when image is loaded
    displayContent = (
      <div>
        {/* <p>Timestamp :{timeSize.time}</p>
        <p>size: {timeSize.size}bytes</p>
        <p>cloudinary url :{imgUrl}</p> */}
        <img className="image" src={imgUrl} alt="generated" />
      </div>
    );
  } else {
    displayContent = (
      <div className="loading-style">
        <img className="start-img" src="/error.jpg" alt="error" />
        <h4>There is cooldown in pikwy api wait for 5min - 10min</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-color">
      <div className="container-fluid navbar-container">
        <h1 className="web-name">SnapWeb</h1>
        <span className="sub-text">snap the web</span>
      </div>
      <div className="home-main-container container">
        <p className="wht-color">
          The free API of pikwy have some cooldown period dont search multiple
          link very fast wait for atleast 5min - 10min
        </p>

        <form className="form" onSubmit={generateImg}>
          <input
            value={url}
            type="url"
            name="searchUrl"
            id="searchUrl"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
        {imgUrl ? (
          <>
            <p className="wht-color">Timestamp: {timeSize.time}</p>
            <p className="wht-color">Size: {timeSize.size} bytes</p>
            <p className="wht-color">Cloudinary URL:</p>
            <p className="wht-color url">{imgUrl}</p>
          </>
        ) : (
          <></>
        )}

        <div className="img-display-container container-sm">
          {displayContent}
        </div>
      </div>
    </div>
  );
};

export default Home;
