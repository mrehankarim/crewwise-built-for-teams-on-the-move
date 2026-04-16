import React from 'react'
import Layout from '../../layout'

const AdminLayout = () => {
    const routes=[
        {
            path:"/admin/dashboard",
            text:"Dashboard",
            icon:"material-symbols:dashboard-outline",
        },
        {
            path:"/admin/work-orders",
            text:"Work Orders",
            icon:"akar-icons:clipboard",
        },
        {
            path:"/admin/workers",
            text:"Workers",
            icon:"fluent:people-12-regular",
        },
        {
            path:"/admin/scheduler",
            text:"Scheduler",
            icon:"uil:calendar",
        },
        {
            path:"/admin/attendance",
            text:"Attendance",
            icon:"akar-icons:clock",
        },
        {
            path:"/admin/reports",
            text:"Reports",
            icon:"mdi:report-line",
        },
        {
            path:"/admin/notifications",
            text:"Notifications",
            icon:"lucide:bell",
        },
         {
            path:"/admin/profile",
            text:"Profile",
            icon:"octicon:gear-16",
        }
    ]
  return (
    <>
      <Layout routes={routes}/>
    </>
  )
}

export default AdminLayout
