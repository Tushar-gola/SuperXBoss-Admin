import React, { useEffect, useState } from 'react'
import { Stack, Button, Modal, Box, Grid, FormControl, InputLabel, Select, MenuItem, Backdrop } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Styles from '../../../pages/style.module.css'
import { useFormik } from "formik";
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import RetrieveData from '../../../utils/RetrieveData';
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';

export default function UserCreate({ editModalOpen, closeEditModal, id, userEditData, reload, setReload }) {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');
    const [roleName, setRoleName] = useState([])
    const [eyeToggle, setEyeToggle] = useState(true)
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        closeEditModal()
        setValues({ password: "!@#$%^&*" })
    }

    const handleChangeRole = (event) => {
        setRole(event.target.value);
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
    }, []); // E=>mpty dependency array means this effect runs only once

    useEffect(() => {
        setOpen(editModalOpen);
        editModalOpen && setValues({ name: userEditData?.name, mobile: userEditData?.mobile, whats_app: userEditData?.whats_app, email: userEditData?.email, role: userEditData?.role, address: userEditData?.address, id: userEditData?.id })
    }, [editModalOpen])
    const { handleBlur, handleSubmit, handleChange, values, setFieldValue, setValues } =
        useFormik({
            initialValues: {
                name: "",
                mobile: "",
                whats_app: "",
                email: "",
                role: "",
                address: "",
                password: "!@#$%^&*",
            },
            onSubmit: async (values) => {
                dispatch(openLoader(true));
                let AxiosFetch
                if (userEditData) {
                    AxiosFetch = await AxiosFetchMethod(
                        {
                            url: `${process.env.REACT_APP_BASE_URL}/api/update/user-details-update`,
                            method: "put",
                            data: values,
                            headers: { Authorization: brToken },
                        });
                    userEditData = null

                } else {

                    AxiosFetch = await AxiosFetchMethod(
                        {
                            url: `${process.env.REACT_APP_BASE_URL}/api/create/user-create`,
                            method: "post",
                            data: values,
                            headers: { Authorization: brToken },
                        });

                }

                if (AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        values.name = ''
                        values.address = ''
                        values.email = ""
                        values.role = ""
                        values.whats_app = ""
                        values.mobile = ""
                        handleClose()
                        setReload(!reload)
                    }
                }
            }
        })
    useEffect(() => {
        setFieldValue('role', role)
    }, [role])

    const roleRetrieve = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/roles-retrieve`,
            headers: { Authorization: brToken },
        });
        setRoleName(data?.rows)
    }

    useEffect(() => {
        open && roleRetrieve()
    }, [open])


    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">Users</h1>
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
                className="modal"

            >
                {/* <div className='asjddhdasj'> */}
                <Box className={Styles.style2}>
                    <div className="modal_title">
                        <h2>Create Users</h2>
                    </div>
                    <hr />
                    <form className="catagories_form" onSubmit={handleSubmit} >

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name?.toLowerCase()}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="mobile">Mobile</label>
                                <input
                                    type="number"
                                    name="mobile"
                                    placeholder="Mobile"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.mobile}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="whatsapp_no">Whatsapp No</label>
                                <input
                                    type="text"
                                    name="whats_app"
                                    placeholder="Whatsapp"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.whats_app}

                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="password">Password</label>
                                <div className='password-feild'>
                                    <input
                                        type={eyeToggle ? "password" : "type"}
                                        name="password"
                                        placeholder="password"
                                        onChange={handleChange}
                                        onBl ur={handleBlur}
                                        value={values.password}
                                        disabled={userEditData ? true : false}
                                    />
                                    <div className='password-eye-btn' onClick={() => setEyeToggle(!eyeToggle)}>
                                        {eyeToggle ? <RemoveRedEyeIcon fontSize="large" /> : <VisibilityOffIcon fontSize="large" />}
                                    </div>
                                </div>
                                

                            </Grid>

                            <Grid item xs={6}>

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-helper-label" style={{ color: "grey", fontSize: "1.4rem", fontWeight: "400" }}>Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={values.role}
                                        label="Role"
                                        onChange={handleChangeRole}
                                    >
                                        <MenuItem sx={{ fontSize: "1.5rem", backgroundColor: "lightgray" }}>
                                            <em>None</em>
                                        </MenuItem>
                                        {roleName && roleName.map(({ id, name }, index) => {
                                            // console.log(id);
                                            return (
                                                <MenuItem value={id} key={index} sx={{ fontSize: "1.5rem" }}>{name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>

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
                </Box>
                {/* </div> */}
            </Modal>

        </>
    )
}
