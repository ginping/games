import Link from "next/link";
import { Game1024 } from "./Game1024";

export default function Game1024Page() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/" className="back-link fade-up">
          <span aria-hidden>←</span>
          返回
        </Link>
        <Game1024 />
      </div>
    </main>
  );
}
