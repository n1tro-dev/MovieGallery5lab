import { Link } from "react-router-dom";
import { useState } from "react";

import error0 from "../assets/error0.mp4";
import error1 from "../assets/error1.gif";
import error2 from "../assets/error2.gif";
import error3 from "../assets/error3.gif";
import error4 from "../assets/error4.gif";
import error5 from "../assets/error5.gif";
import error6 from "../assets/error6.gif";
import error7 from "../assets/error7.gif";
import error8 from "../assets/error8.gif";
import error9 from "../assets/error9.gif";
import error10 from "../assets/error10.gif";
import error11 from "../assets/error11.gif";
import error12 from "../assets/error12.gif";
import error13 from "../assets/error13.gif";

const NotFound = () => {
  const mediaList = [
    error0,
    error1,
    error2,
    error3,
    error4,
    error5,
    error6,
    error7,
    error8,
    error9,
    error10,
    error11,
    error12,
    error13,
  ];

  const [currentMedia] = useState(() => {
    const saved = localStorage.getItem("error_sequence_index");
    let index = parseInt(saved, 10);

    if (isNaN(index) || index >= mediaList.length || index < 0) {
      index = 0;
    }

    const nextIndex = (index + 1) % mediaList.length;
    localStorage.setItem("error_sequence_index", nextIndex.toString());

    return mediaList[index];
  });

  const renderMedia = (src) => {
    if (!src) return null;

    const isVideo =
      typeof src === "string" && src.toLowerCase().includes(".mp4");
    const style = {
      width: "400px",
      borderRadius: "15px",
      display: "block",
      margin: "0 auto",
    };

    if (isVideo) {
      return (
        <video
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="error-gif"
          style={style}
        />
      );
    } else {
      return (
        <img
          key={src}
          src={src}
          alt="Error"
          className="error-gif"
          style={style}
        />
      );
    }
  };

  return (
    <div className="page" style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>

      <div style={{ marginBottom: "20px", minHeight: "300px" }}>
        {renderMedia(currentMedia)}
      </div>

      <Link to="/">
        <button style={{ padding: "10px 20px", cursor: "pointer" }}>
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
