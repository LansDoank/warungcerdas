import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HalamanKasir from "./components/pages/Kasir.jsx";
import ScanStruk from "./components/pages/Scan.jsx";
import LoginPage from "./components/pages/Login.jsx";
import RiwayatTransaksi from "./components/pages/RiwayatTransaksi.jsx";
import TambahProduk from "./components/Fragments/TambahProduk/index.jsx";
import TambahProdukMasal from "./components/Fragments/TambahProdukMasal/index.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Produk from "./components/pages/Produk.jsx";
import RegisterPage from "./components/pages/Register.jsx";

const route = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      {
        path: "dashboard", 
        element: <Dashboard />,
      },
      {
        path: "produk", 
        element: <Produk />, 
      },
      {
        path: "kasir",
        element: <HalamanKasir />,
      },
      {
        path: "scan",
        element: <ScanStruk />,
      },
      {
        path: "riwayat",
        element: <RiwayatTransaksi />,
      },
    ],
  },
  {
    path: "/tambah-produk",
    element: <TambahProduk />
  },
  {
    path: "/tambah-produk-masal",
    element: <TambahProdukMasal />
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>
);
