import { ReactNode } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageShellProps {
  /** Right-aligned header text or element */
  headerRight?: ReactNode;
  /** Override the default title next to the logo */
  title?: string;
  children: ReactNode;
}

export default function PageShell({ headerRight, title, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Star className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg">{title ?? "Constellation Forensics"}</span>
          </button>
          {headerRight && <div className="text-sm text-muted-foreground">{headerRight}</div>}
        </div>
      </header>
      <main className="flex-1 px-6 pb-12">{children}</main>
    </div>
  );
}
