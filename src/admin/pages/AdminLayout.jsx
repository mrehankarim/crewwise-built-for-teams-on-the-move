import React from 'react'
import Layout from '../../Layout'

const AdminLayout = () => {
    const routes=[
        {
            path:"/admin/dashboard",
            text:"Dashboard",
            icon:"material-symbols:dashboard-outline",
        },
        {
            path:"/admin/organizations",
            text:"Organizations",
            icon:"mdi:office-building",
        },
        {
            path:"/admin/users",
            text:"All Users",
            icon:"fluent:people-12-regular",
        },
        {
            path:"/admin/subscriptions",
            text:"Subscriptions",
            icon:"mdi:crown",
        },
        {
            path:"/admin/plans",
            text:"Plans",
            icon:"mdi:cash-register",
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
