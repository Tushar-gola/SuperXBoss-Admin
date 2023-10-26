import axios from 'axios'
import React from 'react';
import { enqueueSnackbar } from 'notistack'
import { Navigate } from 'react-router-dom'
export const RetrieveData = async (options) => {
    return await axios({
        ...options
    }).then((responses) => {
        console.log(responses.message);
        return responses?.data
    }).catch((error) => {
        if (error?.response?.status === 401) {
            <Navigate to="/signIn" />
            localStorage.clear()
            window.location.reload();
        }
        if(error.message === 'Network Error'){
            enqueueSnackbar(error.message, { variant: "error" })
        }

        console.log(error.message, "hhhhhhhhhhhhhhhhhhhhhhhhhh")
        return error
    });
}