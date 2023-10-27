/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Box, Modal, Button, Grid, FormControlLabel, FormGroup, OutlinedInput, InputLabel, FormControl, Checkbox, Select } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import {AxiosFetchMethod, RetrieveData} from "../../../utils";
import Styles from '../../../pages/style.module.css'
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,
    },
}));


export const AddRolePermission =({ modalOpen, modalClose, RoleData }) => {
    const [permission, setPermission] = React.useState([])
    const [checked, setChecked] = React.useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        modalOpen && userPermissionRetreive();
        modalOpen && assignCheckedRetrieve();

    }, [modalOpen])
    useEffect(() => {
        RoleData && setValues({ name: RoleData?.name })
    }, [RoleData])

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
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/role-permission-retrieve?role_id=${RoleData?.id}`,
            });
            let permissionIdsArray = data.map(item => +item?.permission_id);
            setChecked(permissionIdsArray.length > 0 ? permissionIdsArray : [])
        } catch (e) {
            console.log(e?.message);
        }
    }
    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                name: "",
            },
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/role-assign-permission`,
                    method: "post",
                    data: { role_id: RoleData.id, permission_id: checked },
                });
                if (AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch?.type === "success") {
                        dispatch(openLoader(false));
                        modalClose()
                        setChecked([])
                    }
                }
            },
        });

    return (
        <>
            <Modal
                open={modalOpen}
                onClose={modalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style}>
                    <div className="modal_title">
                        <h2>Add Role Permission</h2>
                    </div>
                    <hr />
                    <form className="catagories_form"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label htmlFor="name">Role Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                placeholder="Role Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                            />
                        </div>

                        <div>
                            <FormControl sx={{ width: "99%", margin: "1rem 0" }} >
                                <InputLabel id="demo-multiple-checkbox-label" sx={{ fontSize: "2rem" }}>Permissions</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple

                                    value={checked}
                                    input={<OutlinedInput label="Permissions" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    sx={{ fontSize: "1.4rem" }}
                                >
                                    {permission.length > 0 ? permission?.map((item, index) => {
                                        console.log(permission, "llllllllllll")
                                        return (
                                            <Grid container spacing={1} sx={{ padding: "1.5rem 3rem", width: "500px", }} key={index}>
                                                <Grid item xs={12} ><h1>{item?.heading}</h1></Grid>
                                                {item?.permission?.map(({ name, id }, index) => {
                                                    return (
                                                        <Grid item xs={12} key={index} >
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
                                                                            fontSize: "1.5rem"
                                                                        }
                                                                    }}
                                                                />
                                                            </FormGroup>
                                                        </Grid>
                                                    )
                                                })}

                                            </Grid>
                                        )
                                    }) : <div style={{ display: "flex", justifyContent: "center" }}>
                                        <CircularProgress sx={{ color: "#1B4B66" }} />
                                    </div>}
                                </Select>
                            </FormControl>
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
                                onClick={modalClose}
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
