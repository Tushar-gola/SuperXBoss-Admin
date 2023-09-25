import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, Button, Dialog, Grid } from "@mui/material";
import { CouponValidate } from "../../../schemas/index";

import { openLoader } from "../../../actions/index";
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { enqueueSnackbar } from 'notistack'
import { useDispatch } from "react-redux";
import Slide from '@mui/material/Slide';
import { useFormik } from "formik";
import moment from "moment/moment";
import dayjs from 'dayjs';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CouponModal({ reload, setReload, couponModalOpen, setCouponModalOpen, modaldata, setModaldata }) {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const dispatch = useDispatch();
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCouponModalOpen()
        setValues({})
        setModaldata(false)
        setStartDate('')
        setEndDate('')
    };
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '*') {
                event.preventDefault()
                handleOpen();
            }
        };
        window.addEventListener('keyup', handleKeyPress);
        return () => {
            window.addEventListener('keyup', handleKeyPress);
        }
    }, []); // E=>mpty dependency array means this effect runs only once
    useEffect(() => {
        setOpen(couponModalOpen)
    }, [couponModalOpen])

    useEffect(() => {
        if (modaldata) {
            setValues({ code: modaldata?.code, amount: modaldata?.amount, min_cart_amt: modaldata?.min_cart_amt, description: modaldata?.description, id: modaldata?.id });
            setStartDate(dayjs(modaldata?.start_date?.split(" ")?.join("-")))
            setEndDate(dayjs(modaldata?.end_date?.split(" ")?.join("-")))
        }
    }, [modaldata])
    const { handleBlur, handleSubmit, handleChange, values, setValues, errors, touched } =
        useFormik({
            initialValues: {
                code: "",
                amount: "",
                min_cart_amt: "",
                description: "",
            },
            validationSchema: CouponValidate
            ,
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let AxiosFetch;
                if (startDate != '' && endDate != '') {
                    if (modaldata) {
                        AxiosFetch = await AxiosFetchMethod({
                            url: `${process.env.REACT_APP_BASE_URL}/api/update/coupon-update`,
                            method: "put",
                            data: { ...values, start_date: moment(startDate)?.format('YYYY-MM-DD'), end_date: moment(endDate)?.format('YYYY-MM-DD') },
                            headers: { Authorization: brToken },
                        });
                        modaldata = null
                    } else {
                        AxiosFetch = await AxiosFetchMethod({
                            url: `${process.env.REACT_APP_BASE_URL}/api/create/coupon-create`,
                            method: "post",
                            data: { ...values, start_date: moment(startDate)?.format('YYYY-MM-DD'), end_date: moment(endDate)?.format('YYYY-MM-DD') },
                            headers: { Authorization: brToken },
                        });
                    }

                    if (AxiosFetch?.response?.data.type === "error") {
                        dispatch(openLoader(false));
                    } else {
                        if (AxiosFetch.type === "success") {
                            dispatch(openLoader(false));
                            values.code = ""
                            values.description = ""
                            values.amount = ""
                            values.min_cart_amt = ""
                            setStartDate('')
                            setEndDate('')
                            handleClose()
                            setReload(!reload)
                        }
                    }
                } else {
                    dispatch(openLoader(false));
                    enqueueSnackbar("Date is Required", { variant: "error" })
                }

            },
        });




    return (
        <div>
            <Stack spacing={2} direction="row" >
                <h1 className="btnName">Coupon</h1>
                <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={handleOpen}
                    className="BtnSvg"
                    sx={{
                        backgroundColor: "#1B4B66",
                        height: "3.8rem",
                    }}>
                </Button>
            </Stack >
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >

                <div className="modal_title">
                    <h2>Create Coupon</h2>
                </div>
                <hr />
                <form className="catagories_form"
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <label htmlFor="start_date">Start Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DatePicker label="Basic date time picker" required={true} disablePast value={startDate} onChange={(e) => { setStartDate(e?.$d); }} sx={{
                                        input: { border: 0 },
                                        '& input:focus': {
                                            border: 0,
                                            boxShadow: "none"
                                        }, label: { fontSize: "1.2rem", fontWeight: 400 }
                                    }} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={6}>
                            <label htmlFor="Exd">Expire Date</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DatePicker label="Basic date time picker" required={true} disablePast variant="inline" value={endDate} onChange={(e) => setEndDate(e?.$d)} sx={{
                                        input: { border: 0 },
                                        '& input:focus': {
                                            border: 0, boxShadow: "none"
                                        }, label: { fontSize: "1.2rem", fontWeight: 400 },
                                    }}
                                        PopperProps={{
                                            style: {
                                                border: '2px solid red',
                                                borderRadius: '8px',
                                                backgroundColor: 'lightgray',
                                            },
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor="title">Code</label>
                            <input
                                type="text"
                                name="code"
                                id="name"
                                // required
                                placeholder="Code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code || ''}
                            />
                            <div className='yup-error'>
                                {errors.code && touched.code ? <span className='err'>{errors.code}</span> : null}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor="name">Amount</label>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                // required
                                placeholder="Amount"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amount || ''}
                            />
                            <div className='yup-error'>
                                {errors.amount && touched.amount ? <span className='err'>{errors.amount}</span> : null}
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor="MinAmount">Minimum Amount</label>
                            <input
                                type="text"
                                name="min_cart_amt"
                                id="MinAmount"
                                // required
                                placeholder="Amount"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.min_cart_amt || ''}
                            />
                            <div className='yup-error'>
                                {errors.min_cart_amt && touched.min_cart_amt ? <span className='err'>{errors.min_cart_amt}</span> : null}
                            </div>
                        </Grid>



                        <Grid item xs={12}>
                            <label htmlFor="name">Description</label>
                            <textarea
                                type="text"
                                name="description"
                                // required
                                id="description"
                                placeholder="Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description || ''}
                            />
                        </Grid>

                    </Grid>

                    <div
                        className="modal_btn"
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "flex-end",
                        }}
                    >

                        <Button
                            variant="outlined"
                            sx={{
                                border: "2px solid #1B4B66",
                                '&:hover': {
                                    border: "2px solid #1B4B66",
                                }
                            }}
                            onClick={handleClose}
                            className="btn_main2"
                        >
                            Close
                        </Button>
                        <Button variant="contained" className="btn_main" type="submit" endIcon={<SendIcon />}>
                            Submit
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div >
    )
}
