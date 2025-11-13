import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="w-full text-center text-xs text-muted-foreground">
      &copy;{" "}
      <Link
        href="https://www.linkedin.com/in/aleoterob/"
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:text-primary/90 transition-colors"
      >
        Alejandro Otero
      </Link>{" "}
      2025 | v0.0.1-beta
    </footer>
  );
}
