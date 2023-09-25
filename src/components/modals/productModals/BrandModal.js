import React, { useEffect, useState } from "react";
import { Box, Modal, Stack, Button, Grid, FormGroup, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from "react-router-dom";
import RetrieveData from '../../../utils/RetrieveData';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';



const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,

    },
}));
let x;

export default function BrandModal({ modalOpen, modalClose, data, id, productData }) {
    // console.log(productData.name)
    // console.log(productData.brand.id)
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([])
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    const handleClose = () => {
        setOpen(false);
        modalClose()
    };

    const retrieveSelectedBrands = async () => {
        const { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/selected-product-brands?product_id=${id}`,
            headers: { Authorization: brToken },
        });
        setChecked(data.length ? JSON.parse(data[0]?.vehicle_brand_id) : [])
    }

    const { handleSubmit, setFieldValue } =
        useFormik({
            initialValues: {
            },
            onSubmit: async (values) => {


                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/product-list-brand`,
                    method: "post",
                    data: { ...values, product_name: productData?.name, product_brand_id: productData?.brand?.id },
                    headers: { Authorization: brToken },
                });


                if (AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        handleClose()
                    }
                }
            }
        });

    const handleChangeCheckBox = (e, id) => {
        const { checked } = e.target;
        if (checked) {
            setChecked(prev => [...prev, id])
        } else {
            setChecked(prev => prev.filter(p => p !== id))
        }
    }

    useEffect(() => {
        setOpen(modalOpen)
    }, [modalOpen])

    useEffect(() => {
        setFieldValue("product_id", id)
    }, [id])

    useEffect(() => {
        open && retrieveSelectedBrands()
    }, [open])

    useEffect(() => {
        setFieldValue("vehicle_brand", checked)
    }, [checked])
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style2}>
                    <div className="modal_title">
                        <h2>Brands</h2>
                    </div>
                    <hr />
                    <form className="catagories_form"
                        onSubmit={handleSubmit}
                    >
                        <Grid container spacing={1}>
                            {data && data?.map(({ id, name }, index) => {
                                return (
                                    <Grid item xs={3} key={index} sx={{ display: "flex", alignItems: "center" }} >
                                        <FormGroup>
                                            <FormControlLabel control={<CustomCheckbox checked={checked?.includes(id)} size="large" onChange={(e) => {
                                                handleChangeCheckBox(e, id)
                                            }}
                                            />} label={name} sx={{
                                                color: "grey", span: {
                                                    fontSize: "1.6rem"
                                                }
                                            }} />
                                        </FormGroup>
                                    </Grid>
                                );
                            })}
                        </Grid>
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
                        </div>
                    </form>
                </Box>
            </Modal >
        </>
    )
}
