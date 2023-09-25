import axios from 'axios'

import { Navigate } from 'react-router-dom'
const RetrieveData = (options) => {
    return axios({
        ...options
    }).then((responses) => {
        return responses?.data
    }).catch((error) => {
        if (error?.response?.status == 401) {
            <Navigate to="/signIn" />
            localStorage.clear()
        }
    
        console.log(error?.response?.data, "hgghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        return error
    });
}
export default RetrieveData;