import { Outlet } from "react-router-dom"
import Sidebar from "./components/ui/Sidebar"
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

const Layout = ({ routes }) => {
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900) {
                setShowMenu(false);
            } else {
                setShowMenu(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex">
            <Sidebar
                username={user?.name || "User"}
                role={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"}
                routes={routes}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
            />

            <div
                className="transition-all duration-300 ease-in-out w-full"
                style={{
                    marginLeft: showMenu ? "20%" : "0%",
                    width: showMenu ? "80%" : "100%",
                }}
            >
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
