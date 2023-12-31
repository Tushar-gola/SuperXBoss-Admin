/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box, IconButton } from "@mui/material";
import { BannerModal } from '../components';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import { RetrieveData, AxiosFetchMethod } from '../utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
export const Banner = () => {
    const [reload, setReload] = useState(false)
    const [bannerData, setBannerData] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [bannerEditData, setBannerEditData] = React.useState(null)
    const dispatch = useDispatch();
    useEffect(() => {
        bannerRetrieve()
    }, [reload])


    const bannerRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/banner-retrieve`,
        });
        if (data) {
            setBannerData(data)
            dispatch(openLoader(false));
        }
    }
    const handleDelete = async (deleteId) => {
        dispatch(openLoader(true));
        const AxiosFetch = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/delete/banner-remove`,
            method: "delete",
            data: { id: deleteId },
        });
        if (AxiosFetch.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload)
        } else {
            dispatch(openLoader(false));
        }


    }
    return (
        <div>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={3}>
                        <BannerModal setBannerData={setBannerData} modalOpen={modalOpen} closeModal={() => setModalOpen(false)} bannerEditData={bannerEditData} setBannerEditData={setBannerEditData} />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: "3rem", padding: "2rem" }}>
                {
                    bannerData && bannerData.map((item, index) => {
                        return (
                            <Grid item xs={3} key={index} sx={{ position: "relative" }} className='banner-box'>
                                <img src={` ${process.env.REACT_APP_BASE_URL}/upload/banner/${item?.image}`} alt='_blank' style={{ width: "100%", height: "300px" }} />

                                <div className='delete-banner'>
                                    <IconButton onClick={() => handleDelete(item?.id)}>
                                        <DeleteSweepIcon sx={{ fontSize: "3rem", color: "#1B4B66" }} />
                                    </IconButton>
                                    <IconButton onClick={() => { setModalOpen(true); setBannerEditData(item) }}>
                                        <EditIcon sx={{ fontSize: "3rem", color: "#1B4B66" }} />
                                    </IconButton>
                                </div>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    )
}
// handleDelete(item?.id);