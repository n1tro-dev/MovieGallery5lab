// import { Link } from "react-router-dom";
// import error1 from "/src/assets/error1.gif"
// import error2 from "/src/assets/error2.gif"

// const NotFound = () => (
//   <div className="page">
//     <h1>404 - Page Not Found</h1>
//     <img src={error1} alt="Error" className="error-gif" />
//     <br />
//     <img src={error2} alt="Error" className="error-gif" />
//     <br />
//     <Link to="/"><button>Back to Home</button></Link>
//   </div>
// );
// export default NotFound;

import { Link } from "react-router-dom";
// Импортируем как видеофайл
import errorVideo1 from "../assets/error1.gif.mp4";
import errorVideo2 from "../assets/error2.gif.mp4";

const NotFound = () => (
  <div className="page" style={{ textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>

    <div style={{ marginBottom: "20px" }}>
      <video
        src={errorVideo1}
        autoPlay
        loop
        muted
        playsInline
        className="error-gif"
        style={{ width: "400px", borderRadius: "15px" }}
      />
      <video
        src={errorVideo2}
        autoPlay
        loop
        muted
        playsInline
        className="error-gif"
        style={{ width: "400px", borderRadius: "15px" }}
      />
    </div>

    <Link to="/">
      <button>Back to Home</button>
    </Link>
  </div>
);

export default NotFound;
