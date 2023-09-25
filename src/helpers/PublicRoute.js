import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
export default function PublicRoute() {
    let token = localStorage.getItem("token");
    if (!token) {
        return <Outlet />
    } else {
        return <Navigate to="/dashboard" />
    }


}
