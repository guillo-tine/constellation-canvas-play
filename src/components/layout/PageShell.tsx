import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/space/SpaceBackground";

interface PageShellProps {
  headerRight?: ReactNode;
  title?: string;
  children: ReactNode;
}

export default function PageShell({ headerRight, title, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative">
      <SpaceBackground />
      <header className="px-6 py-4 shrink-0 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center glow-border">
              <span className="text-primary text-sm font-display font-bold">★</span>
            </div>
            <span className="font-display text-sm tracking-widest uppercase text-foreground/90">
              {title ?? "Constellation Forensics"}
            </span>
          </button>
          {headerRight && <div className="text-sm text-muted-foreground">{headerRight}</div>}
        </div>
      </header>
      <main className="flex-1 px-6 pb-12 relative z-10">{children}</main>
    </div>
  );
}
