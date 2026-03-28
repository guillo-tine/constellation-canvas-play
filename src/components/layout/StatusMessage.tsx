import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Orbit } from "lucide-react";
import SpaceBackground from "@/components/space/SpaceBackground";

interface StatusMessageProps {
  variant: "loading" | "error" | "empty";
  message?: string;
  action?: ReactNode;
}

export default function StatusMessage({ variant, message, action }: StatusMessageProps) {
  const navigate = useNavigate();

  const defaults: Record<string, string> = {
    loading: "Scanning the cosmos…",
    error: "Signal lost.",
    empty: "Nothing detected.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <SpaceBackground />
      <div className="glass-panel p-10 text-center max-w-sm relative z-10">
        <Orbit
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Back to Base
            </Button>
          )
        )}
      </div>
    </div>
  );
}
