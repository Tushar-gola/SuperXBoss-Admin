/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import {RetrieveData} from '../utils';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
export const Dashboard = () => {
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const [data, setData] = React.useState([])
    useEffect(() => {
        dashboard()
    }, [])

    const dashboard = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/dashboard-data`,
            headers: { Authorization: brToken },
            // params: { page, limit: rowsPerPage }
        });
        console.log({data}, 'data');
        if (data) {
            setData(data);
            dispatch(openLoader(false));
        }else{
            console.log('else');
            dispatch(openLoader(false));
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, mt: "10rem" }}>
                <Grid container spacing={2} px={9}>
                    {
                        data && data?.map((item, index) => {
                            return (
                                <Grid item xs={6} md={8} lg={3} key={index}>
                                    <div className="dash-box">
                                        <div className="dash-box-title">
                                            Total {item?.name?.charAt(0).toUpperCase() + item?.name?.slice(1)}
                                        </div>
                                        <span>{item?.count}</span>
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
        </>
    )

}
