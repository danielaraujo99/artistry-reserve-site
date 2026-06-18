import { cn } from "@/lib/utils";

export function Logo({ className = "h-10 w-auto", variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  return (
    <img
      src="/logo.png"
      alt="Studio de Beleza Elaine Hahn"
      className={cn(className, variant === "light" && "brightness-0 invert")}
    />
  );
}

export function Wordmark({ className = "", variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  const ink = variant === "light" ? "text-background" : "text-foreground";
  const gold = variant === "light" ? "text-gold-soft" : "text-gold-deep";
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span className={cn("text-[10px] uppercase tracking-[0.28em] font-medium", gold)}>Studio de Beleza</span>
      <span className={cn("font-display text-lg font-semibold tracking-tight mt-1", ink)}>Elaine Hahn</span>
    </div>
  );
}
