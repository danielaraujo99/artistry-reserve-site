import { cn } from "@/lib/utils";

export function Logo({ className = "h-10 w-auto", variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  return (
    <img
      src="/logo.png"
      alt="Estúdio Elaine Hahn"
      className={cn(className, variant === "light" && "brightness-0 invert")}
    />
  );
}

export function Wordmark({ className = "", variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  const ink = variant === "light" ? "text-background" : "text-foreground";
  const gold = variant === "light" ? "text-gold-soft" : "text-gold-deep";
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span className={cn("font-serif text-xl tracking-tight", ink)}>Elaine Hahn</span>
      <span className={cn("text-[9px] uppercase tracking-[0.35em] mt-0.5", gold)}>Beauty Studio</span>
    </div>
  );
}
