import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { menuConfig } from "../utils/menu/menuConfig.js";

function Sidebar({ abierto, setMenuAbierto }) {
    const navigate = useNavigate();
    const { user, logout } = useContext(AppContext);
    const roles = user?.roles || [];
    const navRef = useRef(null);
    const asideRef = useRef(null);

    useEffect(() => {
        if (abierto && navRef.current) {
            navRef.current.scrollTop = 0;
        }
    }, [abierto]);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!abierto) return;
            const aside = asideRef.current;
            if (!aside) return;
            if (!aside.contains(e.target)) {
                setMenuAbierto(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [abierto, setMenuAbierto]);

    return (
        <aside ref={asideRef} className={`fixed top-0 left-0 h-full w-64 bg-blue-100
    transition-transform duration-300 z-50
    ${abierto ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Scrollable nav */}
            <nav ref={navRef} className="p-4 h-full overflow-y-auto">
                {menuConfig.map((section) => {
                    const items = section.items.filter(
                        item => item.roles.includes("*") ||
                            roles.some(r => item.roles.includes(r))
                    );
                    if (!items.length) return null;

                    return (
                        <div key={section.section} className="mb-4">
                            <p className="text-gray-500 text-sm mb-2">{section.section}</p>
                            <ul className="space-y-1">
                                {items.map((item) => {
                                    const path =
                                        roles.find(r => item.pathByRole?.[r])
                                            ? item.pathByRole[roles.find(r => item.pathByRole?.[r])]
                                            : item.pathByRole?.default || item.path;

                                    return (
                                        <li key={item.label}>
                                            <NavLink
                                                to={path}
                                                className="block p-2 hover:bg-blue-200 rounded"
                                                onClick={() => setMenuAbierto(false)}
                                            >
                                                {item.label}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
                {/* Logout */}
                <div className="mt-6 border-t pt-4">
                    <button
                        onClick={() => {
                            logout();
                            navigate("/");
                            setMenuAbierto(false);
                        }}
                        className="w-full text-left p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </aside>
    );
}

export default Sidebar;