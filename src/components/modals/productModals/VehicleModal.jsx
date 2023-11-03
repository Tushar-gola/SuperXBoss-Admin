/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Modal, Button, Grid, FormControlLabel, FormGroup, OutlinedInput, InputLabel, MenuItem, FormControl, Checkbox, Select } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import { AxiosFetchMethod, RetrieveData } from "../../../utils";
import Styles from '../../../pages/style.module.css'
import { styled } from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,
    },
}));

export const VehicleModal = ({ modalOpen, modalClose, data, id, productData }) => {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([])
    const [personName, setPersonName] = React.useState([]);
    const [disable, setDisable] = useState([])
    const [getBrandId, setGetBrandId] = useState()
    const dispatch = useDispatch();
    let year = 1999;
    let date = new Date().getFullYear();
    let arrYear = []
    for (let index = year; index < date; index++) {
        arrYear.push(index)
    }
    useEffect(() => {
        setOpen(modalOpen)
        setGetBrandId(productData?.brand_id)
    }, [modalOpen])

    useEffect(() => {
        setFieldValue("product_id", id)
    }, [id])

    useEffect(() => {
        if (data && !!data.length) {
            setPersonName(data);
        }
    }, [data])

    useEffect(() => {
        setFieldValue("vehicle_id", checked)
    }, [checked])

    useEffect(() => {
        open && retrieveSelectedBrands()
    }, [open])

    useEffect(() => {
        setDisable(personName?.filter(d => checked.includes(d.id)).map(fd => fd.name))
    }, [personName, checked])

    const handleClose = () => {
        setOpen(false);
        modalClose()
    };


    const handleValueChange = (id, value) => {
        setPersonName((prevValues) => {
            let found = false;

            const updatedValues = prevValues.map((pn) => {
                if (pn.vehicle_id === id) {
                    found = true;
                    const newYears = typeof value === 'string' ? value.split(',') : value;
                    return {
                        ...pn,
                        years: newYears,

                    };
                } else {
                    return pn;
                }
            });

            if (!found) {
                updatedValues.push({
                    vehicle_id: id,
                    years: typeof value === 'string' ? value.split(',') : value,
                });
            }

            return updatedValues;
        });

    };

    const handleChangeCheckBox = (e, id, name) => {
        const { checked } = e.target;
        if (checked) {
            setChecked(prev => [...prev, id])
            setDisable(p => [...p, name])
        } else {
            setChecked(prev => prev.filter(p => p !== id))
            setDisable(p => p.filter(pe => pe !== name))
        }
    }
    const retrieveSelectedBrands = async () => {
        try {
            const { data } = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/selected-product-brand-vehicle?product_id=${id}`,
            });
            setChecked(JSON?.parse(data[0]?.vehicle_id) ?? [])
            const result = {};
            data?.vehicleYear?.forEach((item) => {
                const { vehicle_id, vehicle_year } = item;
                if (result[vehicle_id]) {
                    result[vehicle_id].years.push(+vehicle_year);
                } else {
                    result[vehicle_id] = { vehicle_id, years: [+vehicle_year] };
                }
            });
            const finalResult = Object.values(result);
            setPersonName(finalResult);
        } catch (error) {
            console.error(error);
        }
    }
    const { handleSubmit, setFieldValue } =
        useFormik({
            initialValues: {
            },
            onSubmit: async (values) => {
                dispatch(openLoader(true));
                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/product-list-brand-vehicle`,
                    method: "post",
                    data: { ...values, year: personName, brand_id: getBrandId },
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
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style3}>
                    <div className="modal_title">
                        <h2>Vehicle</h2>
                    </div>
                    <hr />
                    <form className="catagories_form" onSubmit={handleSubmit} >
                        {data && data?.map(({ brandName, data }, index) => {
                            return (
                                <Grid container spacing={1} key={index} >
                                    <Grid item xs={12} >
                                        <h1 className="Brand_name_tittle">{brandName.name}</h1>
                                    </Grid>
                                    {
                                        data.length > 0 ? data && data?.map(({ id, name: vehicleName }, index) => {

                                            return (
                                                <Grid item xs={3} sx={{ marginBottom: ".5rem" }} key={index} >
                                                    <FormGroup sx={{ display: "flex" }}>
                                                        <FormControlLabel control={<CustomCheckbox checked={checked?.includes(id)} size="large" onChange={(e) => {
                                                            handleChangeCheckBox(e, id, vehicleName)
                                                        }}
                                                        />} sx={{ span: { fontSize: "1.8rem" } }} label={vehicleName} />
                                                        <FormControl sx={{ width: "200px" }}>
                                                            <InputLabel id="demo-multiple-checkbox-label">Year</InputLabel>
                                                            <Select
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                value={personName.find(pn => pn.vehicle_id === id)?.years || []}
                                                                onChange={e => { handleValueChange(id, e.target.value); }}
                                                                input={<OutlinedInput label="Year" />}
                                                                renderValue={(selected) => selected.join(', ')}
                                                                disabled={!checked.includes(id)}
                                                                sx={{ fontSize: "1.2rem" }}
                                                            >
                                                                {arrYear?.map((year, index) => (
                                                                    <MenuItem key={index} value={year} className="hello">
                                                                        <FormControlLabel control={<CustomCheckbox
                                                                            checked={personName.find(pn => pn.vehicle_id === id)?.years?.includes(year) || false}
                                                                            size='large' />} label={year} sx={{
                                                                                color: "grey", span: {
                                                                                    fontSize: "1.5rem"
                                                                                }, input: {
                                                                                    width: "500%"
                                                                                }
                                                                            }} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </FormGroup>
                                                </Grid>
                                            )
                                        }) : <h3 className="not-exist">Vehicle is not available {brandName.name}...........</h3>
                                    }
                                </Grid>
                            )
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
                            <Button variant="outlined"
                                sx={{
                                    border: "2px solid #1B4B66",
                                    '&:hover': {
                                        border: "2px solid #1B4B66",
                                    }
                                }} className="btn_main2" onClick={modalClose}>
                                Close
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal >
        </>
    )
}
