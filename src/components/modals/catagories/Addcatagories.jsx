/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-const-assign */
import React, { useEffect, useState } from "react";
import { Box, Modal, Stack, Button } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import {AxiosFetchMethod} from "../../../utils";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { CategoryValidate } from '../../../schemas'
export const Addcatagories = (_props) => {
    const { editRowData, setEditRowData, catRowSingleData, setCatRowSingleData, reload, setReload } = _props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);;
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const handleClose = () => {
        setOpen(false);
        setEditRowData(false);
        setValues({})
        setCatRowSingleData(false);
    };

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

    const onUserSubmit = async (values) => {
        dispatch(openLoader(true));
        let AxiosFetch
        if (catRowSingleData) {
            AxiosFetch = await AxiosFetchMethod({
                url: `${process.env.REACT_APP_BASE_URL}/api/update/editCategory`,
                method: "put",
                data: values,
                headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
            }); catRowSingleData = null
        }
        else {
            AxiosFetch = await AxiosFetchMethod({
                url: `${process.env.REACT_APP_BASE_URL}/api/create/createCategory`,
                method: "post",
                data: values,
                headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
            });
        }
        if (AxiosFetch?.type === "error" || AxiosFetch?.response?.data.type === "error") {
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
    }

    const { handleBlur, handleSubmit, handleChange, values, setValues, errors, touched } =
        useFormik({
            initialValues: {
                name: "",
                description: "",
            },
            validationSchema: CategoryValidate,
            onSubmit: async (val̥ues) => {
                onUserSubmit(values)
            },
        });
    // Q6wxtfZpwcRRR

    useEffect(() => {
        if (catRowSingleData) {
            setValues({ name: catRowSingleData?.name, description: catRowSingleData?.description, catId: catRowSingleData?.id })
        }
    }, [catRowSingleData])

    useEffect(() => {
        setOpen(editRowData)
    }, [editRowData])

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
                                value={values.name} />
                            <div className='yup-error' >
                                {errors.name && touched.name ? <span className='err'>{errors.name}</span> : null}
                            </div>
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
