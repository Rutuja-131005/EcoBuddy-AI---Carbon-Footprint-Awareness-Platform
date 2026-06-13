import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen bg-slate-50">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded-b-lg focus:font-bold focus:shadow-md"
    >
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content" tabIndex="-1" className="outline-none">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        <span className="font-semibold text-slate-700">EcoBuddy AI</span>
        <span>Understand your impact. Reduce your footprint. Save the planet.</span>
      </div>
    </footer>
  </div>
);

export default Layout;
