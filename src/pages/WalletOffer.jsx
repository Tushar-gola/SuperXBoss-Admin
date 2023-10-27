/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Box, Grid, Button, Switch, FormControlLabel } from '@mui/material';
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import { AxiosFetchMethod, RetrieveData } from "../utils";
import SendIcon from '@mui/icons-material/Send';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { styled } from '@mui/material/styles';
import { WalletValidate } from '../schemas'
import { isAppendRow } from '../functions';
const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        // backgroundColor:"",
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 18,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="red" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="17" width="17" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        backgroundColor: '#1B4B66',
        width: 16,
        height: 16,
        margin: 2,
    },
}));
export const WalletOffer = () => {
    const dispatch = useDispatch();
    const [rechargeData, setRechargeData] = useState([])
    const [editRechargeData, setEditRechargeData] = useState()
    useEffect(() => {
        RechargeRetrieve()
    }, [])

    useEffect(() => {
        if (editRechargeData) {
            setValues({ amount: editRechargeData?.amount, offer_amount: editRechargeData?.offer_amount, id: editRechargeData?.id })
        }

    }, [editRechargeData])
    const { handleBlur, handleSubmit, handleChange, values, setValues, errors, touched } =
        useFormik({
            initialValues: {
                amount: "",
                offer_amount: "",
            },
            validationSchema: WalletValidate,
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));

                const url = editRechargeData
                    ? `${process.env.REACT_APP_BASE_URL}/api/update/recharge-update`
                    : `${process.env.REACT_APP_BASE_URL}/api/create/recharge-create`;

                const method = editRechargeData ? "put" : "post";

                try {
                    const AxiosFetch = await AxiosFetchMethod({
                        url,
                        method,
                        data: values,
                    });

                    if (AxiosFetch.type === "success") {
                        isAppendRow(setRechargeData, AxiosFetch.data);
                        dispatch(openLoader(false));
                        setValues({
                            amount: "",
                            offer_amount: "",
                        });
                    } else {
                        dispatch(openLoader(false));
                    }

                } catch (error) {
                    console.error('Error:', error);
                    dispatch(openLoader(false));
                }
            },
        });



    const RechargeRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/recharge-retrieve`,
        });
        if (data) {
            setRechargeData(data)
            dispatch(openLoader(false));
        }
    }



    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let data = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/recharge-update`,
            method: "put",
            data: { id: id, status: status },
        });
        if (data) {
            isAppendRow(setRechargeData, data.data);
            dispatch(openLoader(false));
        }
    };


    return (
        <>
            <Box sx={{ width: "60%", margin: "auto", marginTop: "4rem" }}>
                <form className='catagories_form' onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                // required
                                placeholder="Amount"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amount} />
                            <div className='yup-error'>
                                {errors.amount && touched.amount ? <span className='err'>{errors.amount}</span> : null}
                            </div>
                        </Grid>

                        <Grid item xs={5}>
                            <label htmlFor="amount">Offer Amount</label>
                            <input
                                type="number"
                                name="offer_amount"
                                id="offer_amount"
                                // required
                                placeholder="Offer Amount"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.offer_amount} />
                            <div className='yup-error'>
                                {errors.offer_amount && touched.offer_amount ? <span className='err'>{errors.offer_amount}</span> : null}
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" className="btn_main" sx={{ marginTop: "2.5rem", marginLeft: "1rem" }} type="submit" endIcon={<SendIcon />}>
                                {/* Submit */}
                            </Button>
                            {/* </div> */}
                        </Grid>
                    </Grid>

                </form>
            </Box>






            <Grid container spacing={2} sx={{ padding: "0 2.5rem" }}>
                {rechargeData && rechargeData.map((item, index) => {
                    return (
                        <Grid item xs={3} key={index}>
                            <div className="container">
                                <div className={`card-1 card-${item?.status}-1`} >
                                    <div className="main main-1">
                                        <h1>Amount: {item.amount}</h1> <h1>Offer: {item.offer_amount}</h1>

                                    </div>

                                    <div className='tool'>
                                        <div className='coupon-edit' onClick={() => { setEditRechargeData(item) }}>
                                            <ModeEditOutlineIcon sx={{ color: "#1B4B66", fontSize: "2.5rem" }} /> <span>Edit</span>
                                        </div>
                                        <FormControlLabel
                                            control={<Android12Switch checked={item?.status} onClick={() => handleSwitch(item?.id, item?.status)} size="large" />}
                                            label="Status" sx={{
                                                color: "#000", span: {
                                                    fontSize: "1.5rem"
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    )
                })}


            </Grid>


        </>
    )
}
