
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-3">404</h1>
        <p className="text-base text-muted-foreground mb-5">Oops! Page not found</p>
        <Link to="/lake" className="story-link text-sm">Return to Content Lake</Link>
      </div>
    </div>
  );
};

export default NotFound;
