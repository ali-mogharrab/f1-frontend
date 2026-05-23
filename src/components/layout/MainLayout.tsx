import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
