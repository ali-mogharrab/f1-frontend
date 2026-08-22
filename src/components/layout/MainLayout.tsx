import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="app-shell text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
