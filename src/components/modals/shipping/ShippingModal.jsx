/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Stack, Button, Slide, Dialog, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { useFormik } from 'formik';
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import { AxiosFetchMethod } from '../../../utils';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const ShippingModal = ({ reload, setReload, editData, modalOpen, modalClose, setShippingEditdata }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const handleClose = () => {
        setOpen(false)
        modalClose()
        setValues({})
        setShippingEditdata(false)
    }
    React.useEffect(() => {
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
    React.useEffect(() => {
        setOpen(modalOpen)
    }, [modalOpen])

    React.useEffect(() => {
        if (editData) {
            setValues({ id: editData?.id, state: editData?.state, charge: editData?.shippingPrice.toString() });
        }
    }, [editData])

    const { handleBlur, handleSubmit, handleChange, values, setValues } = useFormik({
        initialValues: {
            state: "",
            charge: "",
        },
        onSubmit: async (values) => {
            console.log(values);
            let AxiosFetch;
            dispatch(openLoader(true));

            if (editData) {
                AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/update/shipping-state-update`,
                    method: "put",
                    data: values,
                    headers: { Authorization: brToken }
                })
                editData = null
            } else {
                AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/shipping-state-create`,
                    method: "post",
                    data: values,
                    headers: { Authorization: brToken }
                })
            }

            if (AxiosFetch?.response?.data.type === "error") {
                dispatch(openLoader(false));
            } else {
                if (AxiosFetch?.type === "success") {
                    dispatch(openLoader(false));
                    values.state = ""
                    values.charge = ""
                    console.log("hhhhhhhhhhhhhhhhhhhhhh");
                    handleClose()
                    setReload(!reload)
                }
            }

        }
    })

    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">Shipping</h1>
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



            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="modal_title">
                    <h2>Create Shipping Charges</h2>
                </div>
                <hr />
                <form className="catagories_form"
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <label htmlFor="states">State</label>
                            <input type='text' placeholder='State.' id='states' name='state' onChange={handleChange} value={values.state || ''} onBlur={handleBlur} />
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor="charge">Charges</label>
                            <input type='text' placeholder='Charge' id='charge' name='charge' onChange={handleChange} value={values?.charge || ''} onBlur={handleBlur} />
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
            </Dialog>
        </>
    )
}
