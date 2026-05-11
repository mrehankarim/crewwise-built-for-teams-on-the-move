import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";

const Sidebar = ({ role, username, routes, showMenu, setShowMenu }) => {
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { unreadCount } = useNotification();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <div
                className={`
                    fixed top-0 left-0 h-full overflow-y-auto scrollbar w-[75%] md:w-[20%]
                    flex flex-col justify-between
                    py-6 px-6 z-40 scrollbar-hide
                    transform transition-transform duration-300 ease-in-out
                    ${showMenu ? "translate-x-0" : "-translate-x-full"}
                `}
                style={{
                    background: 'var(--bg-sidebar)',
                    borderRight: '1px solid var(--border-primary)',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                <div>
                    <div className="flex w-full items-center gap-2 pb-4" style={{ borderBottom: '2px solid var(--border-primary)' }}>
                        <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '8px' }}>
                            <Icon icon="mingcute:suitcase-line" width={30} height={30} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold mt-2 font-grotesk" style={{ color: 'var(--text-primary)' }}>
                                CrewWise
                            </h1>
                            <p className="text-sm font-normal font-grotesk" style={{ color: 'var(--text-tertiary)' }}>
                                Field Management
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full items-center gap-2 py-4" style={{ borderBottom: '2px solid var(--border-primary)' }}>
                        <div className="p-2 rounded-full" style={{ background: 'var(--accent-gradient)' }}>
                            <Icon icon="iconamoon:profile" width={30} height={30} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold mt-2 font-grotesk" style={{ color: 'var(--text-primary)' }}>
                                {username}
                            </h1>
                            <p className="text-sm font-normal font-grotesk" style={{ color: 'var(--text-tertiary)' }}>{role}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col w-full py-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                        {routes.map((route, index) => (
                            <NavLink
                                key={index}
                                to={route.path}
                                onClick={() => window.innerWidth < 900 && setShowMenu(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "font-medium"
                                        : ""
                                    }`
                                }
                                style={({ isActive }) => ({
                                    background: isActive ? 'var(--accent-light)' : 'transparent',
                                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                })}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.classList.contains('font-medium')) {
                                        e.currentTarget.style.background = 'var(--bg-hover)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.classList.contains('font-medium')) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Icon icon={route.icon} width={22} height={22} />
                                <span className="text-sm flex-1">{route.text}</span>
                                {route.text === "Notifications" && unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="space-y-3 mt-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
                        style={{
                            background: 'var(--bg-hover)',
                            color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    >
                        <Icon icon={isDark ? "ph:sun-bold" : "ph:moon-bold"} width={20} height={20} />
                        <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex gap-2 items-center justify-center px-8 py-2 mx-auto rounded-md
                        transition-all cursor-pointer"
                        style={{
                            border: '2px solid var(--border-primary)',
                            color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--error)';
                            e.currentTarget.style.borderColor = 'var(--error)';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--border-primary)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Icon icon="material-symbols:logout" width={22} height={22} />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </div>

            <button
                onClick={() => setShowMenu(prev => !prev)}
                className="fixed bottom-4 right-4 text-white rounded-full p-4 z-50
                    hover:shadow-lg hover:scale-[1.05]
                    active:scale-[0.95] transition-all"
                style={{ background: 'var(--accent)' }}
            >
                <Icon icon="gg:menu-round" width="24" height="24" />
            </button>
        </>
    );
};

export default Sidebar;