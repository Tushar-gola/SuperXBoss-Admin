/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Modal, Stack, Button } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import { AxiosFetchMethod } from "../../../utils";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { isAppendRow } from '../../../functions'
export const Addcatagories = (_props) => {
    const { editRowData, setEditRowData, catRowSingleData, setCatRowSingleData, setCatagriesDataRetrive } = _props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);;
    const dispatch = useDispatch();
    const handleClose = () => {
        setOpen(false);
        setEditRowData(false);
        setValues({})
        setCatRowSingleData(false);
    };

    const onUserSubmit = async (values) => {
        dispatch(openLoader(true));
        let AxiosFetch;
        const apiUrl = catRowSingleData
            ? `${process.env.REACT_APP_BASE_URL}/api/update/edit-Category`
            : `${process.env.REACT_APP_BASE_URL}/api/create/createCategory`;

        AxiosFetch = await AxiosFetchMethod({
            url: apiUrl,
            method: catRowSingleData ? "put" : "post",
            data: values,
        });
        dispatch(openLoader(false));
        if (AxiosFetch.type === "success") {
            isAppendRow(setCatagriesDataRetrive, AxiosFetch.data);
            values.name = "";
            values.description = "";
            handleClose();
        }
    }

    const { handleBlur, handleSubmit, handleChange, values, setValues, errors, touched } =
        useFormik({
            initialValues: {
                name: "",
                description: "",
            },
            onSubmit: async (val̥ues) => {
                onUserSubmit(values)
            },
        });
    useEffect(() => {
        if (catRowSingleData) {
            setValues({ name: catRowSingleData?.name, description: catRowSingleData?.description, catId: catRowSingleData?.id })
        }
    }, [catRowSingleData])

    useEffect(() => {
        setOpen(editRowData)
    }, [editRowData])

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
    }, []);

    return (
        <>
            <Stack spacing={2} direction="row" >
                <h1 className="btnName">Categorys</h1>
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
                tabIndex={0}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style}>
                    <div className="modal_title">
                        <h2>Create Category</h2>
                    </div>
                    <hr />
                    <form className="catagories_form" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                placeholder="Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name || ''} />

                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description || ''}
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
