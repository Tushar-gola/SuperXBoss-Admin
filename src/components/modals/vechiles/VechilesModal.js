import React, { useEffect, useState } from "react";
import { Box, Modal, Stack, Button } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
export default function VechilesModal({ reload, setReload, editRowData, setEditRowData, RowSingleData, setRowSingleData }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => { setOpen(true); };
    const dispatch = useDispatch();
    const location = useLocation();
    const handleClose = () => {
        setOpen(false);
        setEditRowData(false);
        setValues({})
        setRowSingleData(false);
    };
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                name: "",
                description: "",
            },
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let AxiosFetch
                if (RowSingleData) {
                    AxiosFetch = await AxiosFetchMethod(
                        {
                            url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-vehicle`,
                            method: "put",
                            data: values,
                            headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
                        });
                    RowSingleData = null

                } else {
                    AxiosFetch = await AxiosFetchMethod({
                        url: `${process.env.REACT_APP_BASE_URL}/api/create/vehicle-segments`,
                        method: "post",
                        data: { ...values, brand_id: location.state },
                        headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
                    });
                }
                if (AxiosFetch?.response?.data.type === "error" || AxiosFetch?.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        values.name = ""
                        values.description = ""
                        handleClose()
                        setReload(!reload)
                    }
                }
            },
        });

    useEffect(() => {
        if (RowSingleData) {
            setValues({ name: RowSingleData?.name, description: RowSingleData?.description, vehicleId: RowSingleData?.id })
        }
    }, [RowSingleData])
    useEffect(() => {
        setOpen(editRowData)
    }, [editRowData])

    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">Vechiles</h1>
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
                        <h2>Create Vechiles</h2>
                    </div>
                    <hr />
                    <form className="catagories_form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="type"
                                name="name"
                                id="name"
                                placeholder="Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name} />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="type"
                                name="description"
                                id="description"
                                placeholder="Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
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
            </Modal>
        </>
    );
}
