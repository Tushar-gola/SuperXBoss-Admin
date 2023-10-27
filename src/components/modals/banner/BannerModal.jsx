import React, { useEffect } from 'react';
import { Box, Grid, Button, Stack, Modal, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import { AxiosFetchMethod, RetrieveData } from "../../../utils";
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from "../../../images/icons8-upload-to-the-cloud-50.png";
import AddIcon from '@mui/icons-material/Add';
import Styles from '../../../pages/style.module.css'
import { isAppendRow } from '../../../functions';
export const BannerModal = ({ setBannerData, modalOpen, closeModal, bannerEditData, setBannerEditData }) => {
    console.log(bannerEditData);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [productId, setProductId] = React.useState([])
    const [getProductId, setGetProductId] = React.useState([])

    const handleClose = () => {
        setOpen(false);
        closeModal()
        setBannerEditData('')
    };
    useEffect(() => {
        modalOpen && setOpen(modalOpen)
        modalOpen && setGetProductId(JSON.parse(bannerEditData.product_id) || [])
    }, [modalOpen])
    const dispatch = useDispatch();
    const [bannerImage, setBannerImage] = React.useState({
        banner_image: "",
        Url: ''
    })
    const maxSize = 800 * 1024;
    const { handleSubmit } =
        useFormik({
            initialValues: {
            },
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let formData = new FormData();
                formData.append('image', bannerImage.banner_image)
                formData.append('ids', JSON.stringify(getProductId))
                formData.append('id', bannerEditData.id)
                const AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/${!bannerEditData ? "create/banner-create" : "update/banner-update"}`,
                    method: !bannerEditData ? "post" : "put",
                    data: formData,
                }, { "Content-Type": "multipart/form-data" });

                if (AxiosFetch.type === "success") {
                    isAppendRow(setBannerData, AxiosFetch.data)
                    dispatch(openLoader(false));
                    setBannerEditData({})
                    setBannerImage({
                        ...bannerImage,
                        Url: '',
                        banner_image: ""
                    })
                    handleClose()
                } else {
                    dispatch(openLoader(false));
                }
            },
        });
    const ProductBanner = async () => {
        dispatch(openLoader(true));
        try {
            const { data } = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/product-banner`,
            });
            if (data) {
                setProductId(data)
                dispatch(openLoader(false));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            dispatch(openLoader(false));
        }
    };
    useEffect(() => {
        ProductBanner()
    }, [])

    const handleIdGet = (event) => {
        const {
            target: { value },
        } = event;
        setGetProductId(value)
    }
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
                                <FormControl fullWidth sx={{ marginTop: ".5rem" }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Product Assign</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={getProductId}
                                        onChange={handleIdGet}
                                        input={<OutlinedInput label="Product Assign   " />}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {productId?.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                <Checkbox checked={getProductId.includes(item?.id)} />
                                                <ListItemText primary={item.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ display: bannerEditData ? "none" : "block" }}>
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
                                        alt="_blank"
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
