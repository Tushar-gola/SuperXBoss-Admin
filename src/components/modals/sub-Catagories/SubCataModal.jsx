/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Stack, Box, Modal, Button } from '@mui/material';
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AxiosFetchMethod } from "../../../utils";
import { openLoader } from "../../../actions/index";
import { useParams } from "react-router-dom";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { isAppendRow } from '../../../functions';

export const SubCataModal = ({ setSubCatData, subCatEditData, editRowData, setEditRowData, setSubCatEditData }) => {
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '*') {
                event.preventDefault()
                handleOpen();
            }
        };
        window.addEventListener('keyup', handleKeyPress);
    }, []); 
    let { id } = useParams();

    useEffect(() => {
        if (subCatEditData) {
            setValues({ name: subCatEditData?.name, description: subCatEditData?.description, catId: subCatEditData?.id })
        }
    }, [subCatEditData])

    useEffect(() => {
        setOpen(editRowData)
    }, [editRowData])

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setValues({})
        setEditRowData(false)
        setSubCatEditData(null)
    };
    const dispatch = useDispatch();
    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                name: "",
                description: "",
            },
            onSubmit: async (val̥ues) => {
                const AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/${subCatEditData ? 'update/edit-category' : 'create/create-sub-category'}`,
                    method: subCatEditData ? "put" : "post",
                    data: subCatEditData ? values : { ...values, parent: id },
                });

                if (AxiosFetch?.type === "success") {
                    setSubCatEditData(null);
                    dispatch(openLoader(false));
                    isAppendRow(setSubCatData, AxiosFetch.data);
                    values.name = "";
                    values.description = "";
                    handleClose();
                } else {
                    dispatch(openLoader(false));
                }
            }
        });



    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">SubCategorys</h1>
                <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={handleOpen}
                    className="BtnSvg"
                    sx={{
                        textAlign: "center",
                        backgroundColor: "#1B4B66",
                        color: "#ffffff",
                        mt: "3rem",
                        height: "3.8rem",
                        fontSize: "1.6rem",
                        fontWeight: "400",
                    }}>
                </Button>
            </Stack >


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={Styles.style}>
                    <div className="modal_title">
                        {subCatEditData ? <h2>Edit Sub-Category</h2> : <h2> Sub-Category</h2>}
                    </div>
                    <hr />
                    <form className="catagories_form"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="type"
                                name="name"
                                id='name'
                                // required
                                placeholder="Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="type"
                                name="description"
                                id='description'
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
            </Modal >





        </>
    )
}
