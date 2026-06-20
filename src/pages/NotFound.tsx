import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <h1 className="font-serif text-7xl font-bold text-gradient-warm mb-4">404</h1>
      <p className="text-muted-foreground mb-8">The page you’re looking for doesn’t exist.</p>
      <Button asChild variant="warm">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
