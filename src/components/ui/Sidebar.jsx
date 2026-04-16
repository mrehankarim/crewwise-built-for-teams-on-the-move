import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ role, username, routes }) => {
    const [showMenu, setShowMenu] = useState(true);

    // Responsive auto behavior
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
        <>
            <div
                className={`
                    fixed top-0 left-0 h-full  overflow-y-auto scrollbar w-[75%] md:w-[20%]
                    bg-white shadow-md flex flex-col justify-between
                    py-6 px-6 z-40 scrollbar-hide
                    transform transition-transform duration-300 ease-in-out
                    ${showMenu ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div>
                    <div className="flex border-b-2 border-gray-200 w-full items-center gap-2 pb-4">
                        <div className="bg-bluelogo p-2 rounded-md">
                            <Icon icon="mingcute:suitcase-line" width={30} height={30} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold mt-2 font-grotesk">
                                Job Glide
                            </h1>
                            <p className="text-sm font-normal font-grotesk">
                                Field Management
                            </p>
                        </div>
                    </div>

                    <div className="flex border-b-2 border-gray-200 w-full items-center gap-2 py-4">
                        <div className="bg-black p-2 rounded-full">
                            <Icon icon="iconamoon:profile" width={30} height={30} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold mt-2 font-grotesk">
                                {username}
                            </h1>
                            <p className="text-sm font-normal font-grotesk">{role}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col w-full border-b border-gray-200 py-4">
                        {routes.map((route, index) => (
                            <NavLink
                                key={index}
                                to={route.path}
                                onClick={() => window.innerWidth < 900 && setShowMenu(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-[#4D6EF027] text-[#4D6EF0] font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Icon icon={route.icon} width={22} height={22} />
                                <span className="text-sm">{route.text}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <button
                    className="flex gap-2 px-8 py-2 border-2 border-gray-400 mx-auto rounded-md
                    hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02] hover:text-white
                    active:scale-[0.98] transition-all"
                >
                    <Icon icon="material-symbols:logout" width={22} height={22} />
                    <span className="text-sm">Logout</span>
                </button>
            </div>

            <button
                onClick={() => setShowMenu(prev => !prev)}
                className="fixed bottom-4 right-4 bg-black text-white rounded-full p-4 z-50
                    hover:bg-gray-900 hover:shadow-lg hover:scale-[1.05]
                    active:scale-[0.95] transition-all"
            >
                <Icon icon="gg:menu-round" width="24" height="24" />
            </button>
        </>
    );
};

export default Sidebar;