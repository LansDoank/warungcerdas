import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : { nama_warung: "Toko Saya" };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "" },
    { name: "Kasir", path: "/kasir", icon: "" },
    { name: "Scan Struk", path: "/scan", icon: "" },
    { name: "Produk", path: "/produk", icon: "" },
    { name: "Riwayat", path: "/riwayat", icon: "" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-e border-gray-100 flex justify-around p-2 z-50 sm:relative sm:w-64 sm:h-screen sm:flex-col sm:justify-start sm:border-t-0 sm:border-r sm:p-6">
      {/* Logo */}
      <div className="hidden sm:block mb-10 text-center">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">
          {user.nama_warung}
        </h1>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex w-full justify-around sm:flex-col sm:gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center sm:flex-row sm:gap-4 p-3 rounded transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold sm:text-sm">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-4 p-3 mt-auto text-red-400 font-bold hover:bg-red-50 rounded-2xl transition-all"
        >
          <span></span> Keluar
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
