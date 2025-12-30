import {Outlet } from "react-router-dom";
import Sidebar from "./components/Fragments/Sidebar";

function App() {


  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;