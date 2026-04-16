import { createBrowserRouter } from "react-router-dom";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminLayout from "./admin/pages/AdminLayout";
import WorkOrder from "./admin/pages/WorkOrder";
import Workers from "./admin/pages/Workers";
import Scheduler from "./admin/pages/Scheduler";
import Attendance from "./admin/pages/Attendance";
import Reports from "./admin/pages/Reports";
import Notifications from "./admin/pages/Notifications";
import Profile from "./admin/pages/Profile";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Login />
        },
        {
            element: <AdminLayout />,
            children: [
                {
                    path: "admin/dashboard",
                    element: <Dashboard />
                },
                {
                    path:"admin/work-orders",
                    element:<WorkOrder/>
                },
                {
                    path:"admin/workers",
                    element:<Workers/>
                },
                {
                    path:"admin/scheduler",
                    element:<Scheduler/>
                },
                {
                    path:"admin/attendance",
                    element:<Attendance/>
                }
                ,{
                    path:"admin/reports",
                    element:<Reports/>
                },
                {
                    path:"admin/notifications",
                    element:<Notifications/>
                },
                {
                    path:"admin/profile",
                    element:<Profile/>
                }
            ]

        }
    ]
)

export default router