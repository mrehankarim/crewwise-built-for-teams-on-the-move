import Layout from "../../Layout"
const SubManagerLayout = () => {
    const routes = [
        { path: "/submanager/dashboard", text: "Dashboard", icon: "material-symbols:dashboard-outline" },
        { path: "/submanager/work-orders", text: "Work Orders", icon: "akar-icons:clipboard" },
        { path: "/submanager/workers", text: "Workers", icon: "fluent:people-12-regular" },
        { path: "/submanager/clients", text: "Clients", icon: "mdi:account-group-outline" },
        { path: "/submanager/scheduler", text: "Scheduler", icon: "uil:calendar" },
        { path: "/submanager/notifications", text: "Notifications", icon: "lucide:bell" },
        { path: "/submanager/profile", text: "Settings", icon: "octicon:gear-16" },
    ]
    return <Layout routes={routes} />
}

export default SubManagerLayout
