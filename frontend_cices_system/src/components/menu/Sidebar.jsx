import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { menuConfig } from "../../utils/menuConfig.js";

import {
    Home,
    User,
    Folder,
    DollarSign,
    Users,
    BarChart3,
    ChevronDown
} from "lucide-react";

function Sidebar({ abierto, setMenuAbierto, toggleRef }) {
    const navigate = useNavigate();
    const { user, logout } = useContext(AppContext);
    const roles = user?.roles || [];
    const navRef = useRef(null);
    const asideRef = useRef(null);

    const [openSections, setOpenSections] = useState([]);

    const toggleSection = (section) => {
        setOpenSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const sectionIcons = {
        "Inicio": <Home size={16} />,
        "Personal": <User size={16} />,
        "Proyectos": <Folder size={16} />,
        "Presupuestos": <DollarSign size={16} />,
        "Usuarios": <Users size={16} />,
        "Reportes": <BarChart3 size={16} />
    };

    useEffect(() => {
        if (abierto && navRef.current) {
            navRef.current.scrollTop = 0;
        }
    }, [abierto]);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!abierto) return;

            const aside = asideRef.current;
            const toggleBtn = toggleRef?.current;

            if (!aside) return;
            if (toggleBtn && toggleBtn.contains(e.target)) return;

            if (!aside.contains(e.target)) {
                setMenuAbierto(false);
            }
        }

        document.addEventListener("pointerdown", handleOutsideClick);
        return () => document.removeEventListener("pointerdown", handleOutsideClick);
    }, [abierto, setMenuAbierto]);

    return (
        <>
            {abierto && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setMenuAbierto(false)}
                />
            )}

            <aside
                ref={asideRef}
                className={`fixed left-0 top-[60px] bottom-0 w-72 
                    bg-blue-50 border-r border-blue-100
                    transition-transform duration-300 z-50
                    flex flex-col
                    ${abierto ? "translate-x-0" : "-translate-x-full"}`}
                >
                {/* HEADER */}
                <div className="p-4 border-b border-blue-100 bg-blue-100 text-blue-900 font-semibold">
                    Menú
                </div>

                <nav ref={navRef} className="p-3 flex-1 overflow-y-auto space-y-2">

                    {menuConfig.map((section) => {
                        const items = section.items.filter(
                            item => item.roles.includes("*") ||
                                roles.some(r => item.roles.includes(r))
                        );
                        if (!items.length) return null;

                        const isOpen = openSections.includes(section.section);

                        return (
                            <div key={section.section} className="rounded-lg">

                                {/* HEADER SECCION */}
                                <button
                                    onClick={() => toggleSection(section.section)}
                                    className="w-full flex justify-between items-center px-3 py-2
                                    text-blue-900 text-sm font-medium
                                    hover:bg-blue-100 rounded-lg transition"
                                >
                                    <div className="flex items-center gap-2">
                                        {sectionIcons[section.section]}
                                        <span>{section.section}</span>
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* ITEMS */}
                                <div
                                    className={`transition-all duration-300 overflow-hidden ${
                                        isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <ul className="space-y-1 pl-6">
                                        {items.map((item) => {
                                            const path =
                                                roles.find(r => item.pathByRole?.[r])
                                                    ? item.pathByRole[roles.find(r => item.pathByRole?.[r])]
                                                    : item.pathByRole?.default || item.path;

                                            return (
                                                <li key={item.label}>
                                                    <NavLink
                                                        to={path}
                                                        onClick={() => setMenuAbierto(false)}
                                                        className={({ isActive }) =>
                                                            `block px-3 py-2 rounded-lg text-sm transition
                                                            ${
                                                                isActive
                                                                    ? "bg-blue-200 text-blue-900 font-semibold"
                                                                    : "text-blue-800 hover:bg-blue-100"
                                                            }`
                                                        }
                                                    >
                                                        {item.label}
                                                    </NavLink>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                            </div>
                        );
                    })}

                    {/* LOGOUT */}
                    <div className="mt-6 border-t border-blue-100 pt-4">
                        <button
                            onClick={() => {
                                logout();
                                navigate("/");
                                setMenuAbierto(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg
                            text-red-500 hover:bg-red-100 transition"
                        >
                            Cerrar sesión
                        </button>
                    </div>

                </nav>
            </aside>
        </>
    );
}

export default Sidebar;