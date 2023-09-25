import React, { useState } from 'react'
import { Box, Modal, Stack, Button } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
export default function AddRole({ reload, setReload }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '*') {
                event.preventDefault()
                setOpen(true);
            }
        };
        window.addEventListener('keyup', handleKeyPress);
        return () => {
            window.addEventListener('keyup', handleKeyPress);
        }
    }, []); // E=>mpty dependency array means this effect runs only once
    const { handleBlur, handleSubmit, handleChange, values } =
        useFormik({
            initialValues: {
                name: "",
                description: "",
            },
            onSubmit: async (val̥ues) => {
                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/role-create`,
                    method: "post",
                    data: values,
                    headers: { Authorization: brToken },
                });
                if (AxiosFetch?.response?.data.type === "error") {
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

    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">Add Role</h1>
                <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
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
                        <h2>Create Role</h2>
                    </div>
                    <hr />
                    <form className="catagories_form"
                        onSubmit={handleSubmit}
                    >

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
                                value={values.name}
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="text"
                                name="description"
                                required
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
                            <Button variant="contained" className="btn_main" type="submit">
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleClose}
                                className="btn_main"
                            >
                                Close
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

        </>
    )
}
