import React, { useEffect, useState } from 'react'
import { Stack, Button, Modal, Box, MenuItem, Select } from '@mui/material';
import Styles from '../../../pages/style.module.css'
import { useFormik } from 'formik';
import AxiosFetchMethod from '../../../utils/AxiosInstance';
import FormControl from '@mui/material/FormControl';
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

const CustomSelect = styled(Select)({
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '0',
    minWidth: '200px',
    margin: ".5rem 0"
});

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: '#000000',
    },
}));

export default function BrandDetailsModal({ setReload, reload, brandEditData, setBrandEditData, brandEditModalOpen, setBrandEditModalOpen }) {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
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
    }, []); // Empty dependency array means this effect runs only once

    const types = [
        {
            value: "vehicle",
            label: "Vehicle"

        }, {
            value: "Spare Parts",
            label: "Spare Parts"
        },
        {
            value: "vehicle + Spare Parts",
            label: "Vehicle + Spare Parts"
        }
    ];
    useEffect(() => {
        if (brandEditData) {
            setValues({ name: brandEditData?.name, description: brandEditData?.description, type: brandEditData?.type, brandId: brandEditData?.id })
        }
    }, [brandEditData])

    useEffect(() => {
        setOpen(brandEditModalOpen)
    }, [brandEditModalOpen])

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setBrandEditModalOpen(false)
        setValues({})
        setBrandEditData(false)
    }

    const { handleBlur, handleSubmit, handleChange, values, setValues } = useFormik({
        initialValues: {
            name: "",
            description: "",
            type: ""
        },
        onSubmit: async (values) => {
            let AxiosFetch;
            dispatch(openLoader(true));
            if (brandEditData) {
                AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-brand`,
                    method: "put",
                    data: values,
                    headers: { Authorization: brToken },
                })
                brandEditData = null

            } else {
                AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/create-brand`,
                    method: "post",
                    data: values,
                    headers: { Authorization: brToken }
                })
            }
            if (AxiosFetch?.response?.data.type === "error" || AxiosFetch?.type === "error") {
                dispatch(openLoader(false));
            } else {
                if (AxiosFetch?.type === "success") {
                    dispatch(openLoader(false));
                    values.name = ""
                    values.description = ""
                    values.type = ""
                    handleClose()
                    setReload(!reload)
                }
            }

        }
    })


    return (
        <>

            <Stack spacing={2} direction="row">
                <h1 className="btnName">Brands</h1>
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style}>
                    <div className="modal_title">
                        <h2>Create Brands</h2>
                    </div>
                    <hr />
                    <form className="catagories_form" onSubmit={handleSubmit}>
                        <div className='BrandName'>
                            <label htmlFor="name">Name</label>
                            <input type='text' placeholder='Name' id='name' name='name' onChange={handleChange} value={values.name} onBlur={handleBlur} />
                        </div>

                        <div className='BrandDescription'>
                            <label htmlFor="description">Description</label>
                            <input type='text' placeholder='Description' id='description' name='description' onChange={handleChange} value={values.description} onBlur={handleBlur} />
                        </div>

                        <div className='BrandType'>

                            {/* <ThemeProvider theme={theme}> */}
                            <label htmlFor="type">Type</label>
                            <CustomSelect name='type' value={values.type} id='type' onBlur={handleBlur} onChange={handleChange} fullWidth sx={{ fontSize: "1.3rem", borderRadius: "1rem" }}>
                                <CustomMenuItem sx={{ fontSize: "1.3rem", backgroundColor: "grey !important", }}>---/Select/---</CustomMenuItem>
                                {types.map(({ value, label }, index) => {
                                    return (
                                        <CustomMenuItem value={value} key={index} sx={{ fontSize: "1.3rem" }}>{label}</CustomMenuItem>
                                    )
                                })}
                            </CustomSelect>
                        </div>
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
                </Box>
            </Modal >
        </>
    )
}
