import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
export const ProtectedRoute = () => {
    let token = localStorage.getItem("token");
    if (token) {
        return <Outlet />

    } else {
        return <Navigate to="/signIn" />
    }
}
