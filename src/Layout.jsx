import { Outlet } from "react-router-dom"
import Sidebar from "./components/ui/Sidebar"
const Layout = ({routes}) => {
    return (
        <div className="flex">
            <Sidebar username={"Muhammad Rehan"} role={"Manager"} routes={routes} />
            <Outlet />
        </div>


    )
}

export default Layout
