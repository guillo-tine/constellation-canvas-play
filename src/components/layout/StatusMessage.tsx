import { ReactNode } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StatusMessageProps {
  /** "loading" | "error" | "empty" */
  variant: "loading" | "error" | "empty";
  message?: string;
  action?: ReactNode;
}

export default function StatusMessage({ variant, message, action }: StatusMessageProps) {
  const navigate = useNavigate();

  const defaults: Record<string, string> = {
    loading: "Loading…",
    error: "Something went wrong.",
    empty: "Nothing to show.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-panel p-10 text-center max-w-sm">
        <Star
          className={`w-8 h-8 mx-auto mb-4 ${
            variant === "loading"
              ? "text-primary animate-pulse-soft"
              : variant === "error"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        />
        <p className={`text-sm mb-5 ${variant === "error" ? "text-destructive" : "text-muted-foreground"}`}>
          {message ?? defaults[variant]}
        </p>
        {action ?? (
          variant !== "loading" && (
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back Home
            </Button>
          )
        )}
      </div>
    </div>
  );
}
