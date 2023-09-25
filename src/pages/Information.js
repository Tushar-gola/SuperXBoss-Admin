import React, { useEffect, useState } from 'react'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CategoryIcon from '@mui/icons-material/Category';
import AxiosFetchMethod from "../utils/AxiosInstance";
import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid, Button } from '@mui/material';
import RetrieveData from '../utils/RetrieveData';
import SendIcon from '@mui/icons-material/Send';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

export default function Information() {
    const [reload, setReload] = useState(false)
    const [information, setInformation] = useState([])
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const dispatch = useDispatch();

    useEffect(() => {
        informationRetrieve()
    }, [reload])

    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                rating: "",
                user: "",
                category: "",
                year: ""
            },
            onSubmit: async (val̥ues) => {
                let AxiosFetch;
                dispatch(openLoader(true));
                AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/update/rating-update`,
                    method: "put",
                    data: values,
                    headers: { Authorization: brToken },
                });

                if (AxiosFetch?.type === "error" || AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {

                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        values.rating = ""
                        values.user = ""
                        values.category = ""
                        values.year = ""
                        setReload(!reload)
                    }
                }
            },
        });

    const getRetrieve = (data) => {
        data && setValues({ id: data?.id, rating: data?.rating, user: data?.user, category: data?.category, year: data?.year })
    }


    const informationRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/rating-retrieve`,
            headers: { Authorization: brToken },
        });
        if (data) {
            setInformation(data)
            dispatch(openLoader(false));
        }
    }


    return (
        <>

            <Box sx={{ width: "60%", margin: "auto", marginTop: "4rem" }}>
                <form className='catagories_form'
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <label htmlFor="rating">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                id="rating"
                                // required
                                placeholder="rating"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.rating} />
                        </Grid>

                        <Grid item xs={5}>
                            <label htmlFor="user">User</label>
                            <input
                                type="number"
                                name="user"
                                id="user"
                                // required
                                placeholder="User"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.user} />
                        </Grid>
                        <Grid item xs={5}>
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                // required
                                placeholder="Category"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.category} />
                        </Grid>

                        <Grid item xs={5}>
                            <label htmlFor="year">Year</label>
                            <input
                                type="number"
                                name="year"
                                id="year"
                                placeholder="User"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.year} />
                        </Grid>
                        <Grid item xs={2} >
                            <Button variant="contained" className="btn_main" sx={{ marginTop: "2.5rem", marginLeft: "1rem" }} type="submit" endIcon={<SendIcon />}>
                                Update
                            </Button>
                        </Grid>
                    </Grid>

                </form>
            </Box>



            {information && information.map((information, index) => {
                return (
                    <Box sx={{ display: 'flex', justifyContent: "center", gap: '2rem', background: '#1B4B66', width: '600px', margin: "7rem auto", borderRadius: "20px", padding: "1rem 0", position: "relative" }} className="information-box" key={index}>
                        <div className='information-circle'>
                            <StarOutlineIcon sx={{ fontSize: "4rem" }} />
                            {information.rating}
                        </div>
                        <div className='information-circle'>
                            <PersonIcon sx={{ fontSize: "4rem" }} />
                            {information.user}</div>
                        <div className='information-circle'>
                            <CategoryIcon sx={{ fontSize: "4rem" }} />
                            {information.category}K</div>
                        <div className='information-circle'>
                            <CalendarMonthIcon sx={{ fontSize: "4rem" }} />
                            {information.year}year</div>
                        <div className='information-edit'
                            onClick={() => { getRetrieve(information) }}
                        >
                            <ModeEditOutlineIcon sx={{ color: "white", fontSize: "2.5rem" }} /> <span>Edit</span>
                        </div>

                    </Box>
                )
            })}


        </>
    )
}
