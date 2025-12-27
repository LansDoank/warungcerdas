import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HalamanKasir from "./components/pages/Kasir.jsx";
import ScanStruk from "./components/pages/Scan.jsx";
import LoginPage from "./components/pages/Login.jsx";
import Dashboard from "./components/pages/dashboard.jsx";
import RiwayatTransaksi from "./components/pages/RiwayatTransaksi.jsx";
import TambahProduk from "./components/Fragments/TambahProduk/index.jsx";
import TambahProdukMasal from "./components/Fragments/TambahProdukMasal/index.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/produk",
    element: <App />,
  },
  {
    path: "/tambah-produk",
    element: <TambahProduk />,
  },
  {
    path: "/tambah-produk-masal",
    element: <TambahProdukMasal />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/kasir",
    element: <HalamanKasir />,
  },
  {
    path: "/scan",
    element: <ScanStruk />,
  },
  {
    path: "/riwayat",
    element: <RiwayatTransaksi />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>
);
