/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Box, Modal, Button, Grid, FormGroup, FormControlLabel } from "@mui/material";
import Styles from '../../../pages/style.module.css';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { useFormik } from "formik";
import { openLoader } from "../../../actions/index";
import { useDispatch } from "react-redux";
import {AxiosFetchMethod, RetrieveData} from "../../../utils";


const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,

    },
}));

export const AssignPermission =({ modalOpen, modalClose, id }) => {
    const [permission, setPermission] = useState([])
    const [checked, setChecked] = useState([])
    const dispatch = useDispatch();
    useEffect(() => {
        modalOpen && userPermissionRetreive();
        modalOpen && assignCheckedRetrieve()

    }, [modalOpen, id])

    const userPermissionRetreive = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/permission-retrieve`,
        });
        setPermission(data)
    };


    const handleChangeCheckBox = (e, id) => {
        const { checked } = e.target;
        if (checked) {
            setChecked(prev => [...prev, id])
        } else {
            setChecked(prev => prev.filter(p => p !== id))
        }
    }
    const assignCheckedRetrieve = async () => {
        try {
            let { data } = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/user-permission-retrieve?user_id=${id}`,
            });
            let permissionIdsArray = data.map(item => +item?.permission_id);
            setChecked(permissionIdsArray.length > 0 ? permissionIdsArray : [])
        } catch (e) {
            console.log(e.message);
        }
    }

    const { handleSubmit } =
        useFormik({
            initialValues: {
            },
            onSubmit: async (values) => {
                dispatch(openLoader(true));
                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/user-assign-permission`,
                    method: "post",
                    data: { user_id: id, permission_id: checked },
                });
                if (AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch?.type === "success") {
                        dispatch(openLoader(false));
                        modalClose()

                    }
                }
            }
        });
    return (
        <>
            <Modal
                open={modalOpen}
                onClose={modalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style2}>
                    <div className="modal_title">
                        <h2>Assign  Permission</h2>
                    </div>
                    <hr />
                    <form className="catagories_form"
                        onSubmit={handleSubmit}
                    >

                        {permission && permission?.map((item, index) => {
                            return (
                                <Grid container spacing={1} key={index}>

                                    <Grid item xs={12} ><h1>{item?.heading}</h1></Grid>
                                    {item?.permission?.map(({ name, id }, index) => {
                                        return (
                                            <Grid item xs={3} key={index} >
                                                <FormGroup >
                                                    <FormControlLabel control={<CustomCheckbox
                                                        checked={checked?.includes(id)}
                                                        size="large"
                                                        onChange={(e) => {
                                                            handleChangeCheckBox(e, id)
                                                        }}
                                                    />} label={name}
                                                        sx={{
                                                            color: "grey", span: {
                                                                fontSize: "1.2rem"
                                                            }
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        )
                                    })}
                                </Grid>

                            );
                        })}
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
                                onClick={modalClose}
                                className="btn_main"
                            >
                                Close
                            </Button>
                        </div>
                    </form>
                </Box >
            </Modal >
        </>
    )
}
