import axios from 'axios'
import React from 'react';
import { enqueueSnackbar } from 'notistack'
import { Navigate } from 'react-router-dom'
export const RetrieveData = async (options) => {
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    return await axios({
        ...options, headers: { "Content-Type": "multipart/form-data", Authorization: brToken }
    }).then((responses) => {
        return responses?.data
    }).catch((error) => {
        if (error?.response?.status === 401) {
            <Navigate to="/signIn" />
            localStorage.clear()
            window.location.reload();
        }
        if (error.message === 'Network Error') {
            enqueueSnackbar(error.message, { variant: "error" })
        }

        console.error(error.message, "hhhhhhhhhhhhhhhhhhhhhhhhhh")
        return error
    });
}