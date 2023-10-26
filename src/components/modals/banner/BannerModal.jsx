import React from 'react';
import { Box, Grid, Button, Stack, Modal } from '@mui/material';
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import {AxiosFetchMethod} from "../../../utils";
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from "../../../images/icons8-upload-to-the-cloud-50.png";
import AddIcon from '@mui/icons-material/Add';
import Styles from '../../../pages/style.module.css'
export const BannerModal = ({ reload, setReload }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const [bannerImage, setBannerImage] = React.useState({
        banner_image: "",
        Url: ''
    })
    const maxSize = 800 * 1024; // 800kb in bytes




    const { handleSubmit } =
        useFormik({
            initialValues: {

            },
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let formData = new FormData();

                formData.append('image', bannerImage.banner_image)

                const AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/banner-create`,
                    method: "post",
                    data: formData,
                    headers: { Authorization: brToken },
                });

                if (AxiosFetch?.type === "error" || AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {

                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        setBannerImage({
                            ...bannerImage,
                            Url: '',
                            banner_image: ""
                        })
                        handleClose()
                        setReload(!reload)
                    }
                }
            },
        });

    return (


        <div>

            <Stack spacing={2} direction="row" >
                <h1 className="btnName">Banner</h1>
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
                        <h2>Create Banner</h2>
                    </div>
                    <hr />
                    <form className='catagories_form' m onSubmit={handleSubmit}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {/* <label htmlFor="image">Offer Image</label> */}
                                <button className="upload_img">
                                    <p>Upload Image</p>
                                    <input
                                        type="file"
                                        title=""
                                        accept="Image/*"
                                        name="image"
                                        onChange={(e) => {
                                            if (e.target.files[0].size > maxSize) {
                                                alert('One or more images are larger than 800KB. Please choose smaller images.');
                                            } else {
                                                setBannerImage({
                                                    ...bannerImage,
                                                    banner_image: e.target.files[0],
                                                    Url: URL.createObjectURL(e.target.files[0]),

                                                })
                                            }
                                        }}
                                    />
                                </button>

                                <div className="output_catagories">
                                    <img
                                        src={bannerImage.Url ? bannerImage.Url : UploadIcon}
                                        // src={UploadIcon}

                                        alt=""

                                        style={bannerImage.Url ? { width: "100%", height: "100%" } : null}
                                    />
                                </div>
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
                                onClick={() => {
                                    handleClose();
                                    setBannerImage({
                                        ...bannerImage,
                                        Url: '',
                                        banner_image: ""
                                    })
                                }}


                                className="btn_main2"
                            >
                                Close
                            </Button>
                            <Button variant="contained" className="btn_main" type='submit' endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </div>

                    </form>
                </Box>
            </Modal>


        </div>
    )
}
