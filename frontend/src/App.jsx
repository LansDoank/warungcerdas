import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./components/Fragments/Sidebar";

function App() {


  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
      {/* Sidebar tetap muncul di samping (Desktop) atau bawah (Mobile) */}
      <Sidebar />

      {/* Area Konten Utama */}
      <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Outlet adalah tempat halaman-halaman lain dirender */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;