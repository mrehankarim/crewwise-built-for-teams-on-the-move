import Layout from '../../Layout'

const ManagerLayout = () => {
    const routes = [
        { path: "/manager/dashboard", text: "Dashboard", icon: "material-symbols:dashboard-outline" },
        { path: "/manager/work-orders", text: "Work Orders", icon: "akar-icons:clipboard" },
        { path: "/manager/workers", text: "Workers", icon: "fluent:people-12-regular" },
        { path: "/manager/clients", text: "Clients", icon: "mdi:account-group-outline" },
        { path: "/manager/inventory", text: "Inventory", icon: "mdi:package-variant-closed" },
        { path: "/manager/scheduler", text: "Scheduler", icon: "uil:calendar" },
        { path: "/manager/attendance", text: "Attendance", icon: "akar-icons:clock" },
        { path: "/manager/reports", text: "Reports", icon: "mdi:report-line" },
        { path: "/manager/notifications", text: "Notifications", icon: "lucide:bell" },
        { path: "/manager/profile", text: "Settings", icon: "octicon:gear-16" },
    ]
    return <Layout routes={routes} />
}

export default ManagerLayout
