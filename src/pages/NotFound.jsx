import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page">
    <h1>404 - Page Not Found</h1>
    <Link to="/"><button>Back to Home</button></Link>
  </div>
);
export default NotFound;