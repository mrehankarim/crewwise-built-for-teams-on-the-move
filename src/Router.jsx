import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OrganizationSetup from "./admin/pages/OrganizationSetup";
import Subscribe from "./admin/pages/Subscribe";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./admin/pages/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Organizations from "./admin/pages/Organizations";
import Subscriptions from "./admin/pages/Subscriptions";
import Notifications from "./admin/pages/Notifications";
import Profile from "./admin/pages/Profile";
import Plans from "./admin/pages/Plans";

import ManagerLayout from "./manager/pages/ManagerLayout";
import ManagerDashboard from "./manager/pages/ManagerDashboard";
import ManagerWorkOrders from "./manager/pages/ManagerWorkOrders";
import ManagerWorkers from "./manager/pages/ManagerWorkers";
import ManagerClients from "./manager/pages/ManagerClients";
import ManagerInventory from "./manager/pages/ManagerInventory";
import ManagerScheduler from "./manager/pages/ManagerScheduler";
import ManagerAttendance from "./manager/pages/ManagerAttendance";
import ManagerReports from "./manager/pages/ManagerReports";
import ManagerNotifications from "./manager/pages/ManagerNotifications";
import ManagerProfile from "./manager/pages/ManagerProfile";

import SubManagerLayout from "./submanager/pages/SubManagerLayout";
import SubManagerDashboard from "./submanager/pages/SubManagerDashboard";
import SubManagerWorkOrders from "./submanager/pages/SubManagerWorkOrders";
import SubManagerWorkers from "./submanager/pages/SubManagerWorkers";
import SubManagerClients from "./submanager/pages/SubManagerClients";
import SubManagerScheduler from "./submanager/pages/SubManagerScheduler";
import SubManagerNotifications from "./submanager/pages/SubManagerNotifications";
import SubManagerProfile from "./submanager/pages/SubManagerProfile";
import WorkOrderDetail from "./components/WorkOrderDetail";
import WorkerDetail from "./components/WorkerDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/login",
        element: <Navigate to="/?auth=login" replace />,
    },
    {
        path: "/register",
        element: <Navigate to="/?auth=register" replace />,
    },
    {
        path: "/setup/organization",
        element: <OrganizationSetup />,
    },
    {
        path: "/setup/subscribe",
        element: <Subscribe />,
    },

    {
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "admin/dashboard", element: <Dashboard /> },
            { path: "admin/organizations", element: <Organizations /> },
            { path: "admin/users", element: <Users /> },
            { path: "admin/subscriptions", element: <Subscriptions /> },
            { path: "admin/plans", element: <Plans /> },
            { path: "admin/notifications", element: <Notifications /> },
            { path: "admin/profile", element: <Profile /> },
        ],
    },

    {
        element: (
            <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "manager/dashboard", element: <ManagerDashboard /> },
            { path: "manager/work-orders", element: <ManagerWorkOrders /> },
            { path: "manager/work-orders/:workOrderId", element: <WorkOrderDetail /> },
            { path: "manager/workers", element: <ManagerWorkers /> },
            { path: "manager/workers/:workerId", element: <WorkerDetail /> },
            { path: "manager/clients", element: <ManagerClients /> },
            { path: "manager/inventory", element: <ManagerInventory /> },
            { path: "manager/scheduler", element: <ManagerScheduler /> },
            { path: "manager/attendance", element: <ManagerAttendance /> },
            { path: "manager/reports", element: <ManagerReports /> },
            { path: "manager/notifications", element: <ManagerNotifications /> },
            { path: "manager/profile", element: <ManagerProfile /> },
        ],
    },

    {
        element: (
            <ProtectedRoute allowedRoles={["submanager"]}>
                <SubManagerLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "submanager/dashboard", element: <SubManagerDashboard /> },
            { path: "submanager/work-orders", element: <SubManagerWorkOrders /> },
            { path: "submanager/work-orders/:workOrderId", element: <WorkOrderDetail /> },
            { path: "submanager/workers", element: <SubManagerWorkers /> },
            { path: "submanager/workers/:workerId", element: <WorkerDetail /> },
            { path: "submanager/clients", element: <SubManagerClients /> },
            { path: "submanager/scheduler", element: <SubManagerScheduler /> },
            { path: "submanager/notifications", element: <SubManagerNotifications /> },
            { path: "submanager/profile", element: <SubManagerProfile /> },
        ],
    },
]);

export default router;
