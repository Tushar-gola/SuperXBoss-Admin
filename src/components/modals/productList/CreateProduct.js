import React, { useEffect, useState } from 'react'
import { Stack, Box, Modal, Button, Grid, Dialog, DialogActions, DialogContent, MenuItem, ListItemText, OutlinedInput, InputLabel, FormControl } from '@mui/material';
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import AxiosFetchMethod from "../../../utils/AxiosInstance";
import { openLoader } from "../../../actions/index";
import Select from '@mui/material/Select';
import Styles from '../../../pages/style.module.css'
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import ImageUploading from 'react-images-uploading';
import RetrieveData from '../../../utils/RetrieveData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Upload from '../../../images/drop-down.png'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SendIcon from '@mui/icons-material/Send';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';



const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,
    },
}));
const CustomSelect = styled(Select)({
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '0',
    minWidth: '200px',
});

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: '#000000',
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateProduct({ reload, setReload, editModalOpen, editModalClose, editData, setEditData }) {
    const [open, setOpen] = React.useState(false)
    const [bulkDiscount, setBulkDiscount] = React.useState(false);
    const [checkboxHandle, setCheckboxHandle] = useState(true)
    const [images, setImages] = React.useState([]);
    const [conditional, setConditional] = useState(false)
    const [source, setSource] = React.useState();
    const [oldImage, setOldImage] = useState([])
    const [sparePart, setSparePart] = useState(null)
    const [gst, setGst] = useState([5, 6, 12, 18, 28])
    const [fieldPairs, setFieldPairs] = useState([{ id: 1, item_count: '', bulk_discount: '' }]);
    const [videoDisable, setVideoDisable] = useState(true)
    const [vehicleSegments, setVehicleSegments] = useState()
    const [segmentName, setSegmentName] = useState([])
    const dispatch = useDispatch();
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => {
        setOpen(false)
        editModalClose()
        setValues({})
        setEditData(null)
        setConditional(false)
        setOldImage([])
        setImages([])
        setSource()
        setSegmentName([])
    }
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const maxNumber = 5; // Maximum number of images
    const maxSize = 800 * 1024; // 800kb in bytes

    useEffect(() => {
        setImages(editData?.productImage);
        sparePartBrand();

        if (editData) {
            setConditional(false)
        }
    }, [editData])

    useEffect(() => {
        setOpen(editModalOpen)
        vehicleSegment();
    }, [editModalOpen])

    useEffect(() => {
        if (editData) {
            setValues({ name: editData?.name, price: editData?.price, b2b_price: editData?.b2b_price, any_discount: editData?.any_discount, brand_id: editData?.brand_id, item_stock: editData?.item_stock, sku_id: editData?.sku_id, weight: editData?.weight, tax_rate: editData?.tax_rate, hsn_code: editData?.hsn_code, ship_days: editData?.ship_days, return_days: editData?.return_days, return_policy: editData?.return_policy, product_id: editData?.id, point: editData?.point, unit: editData?.unit, part_no: editData?.part_no, segment_type: editData?.segment_type, min_qty: editData?.min_qty })
            setFieldPairs(editData?.bulkDiscount)
        }
    }, [editData])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === '*') {
                event.preventDefault()
                handleOpen();
            } else if (event.key === "Escape") {
                handleClose()
            }
        };
        window.addEventListener('keyup', handleKeyPress);
    }, []); // Empty dependency array means this effect runs only once

    const handleClickOpen = () => {
        setBulkDiscount(true);
    };

    const handleCloseModal = () => {
        setBulkDiscount(false);
    };

    const onChange = (imageList, addUpdateIndex) => {

        setImages(imageList)

        if (imageList.length == 0) {
            setConditional(false)
        }
        if (imageList.length > 0) {
            setVideoDisable(false)
        }
        if (editData) {
            setConditional(false)
        }

    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Check the file size
            if (file.size > 1.5 * 1024 * 1024) {
                // File size is greater than 1.5 MB
                alert('Please select a file that is 1.5 MB or smaller.');
                // Clear the input field
                event.target.value = '';
            } else {
                setImages([...images, { video: file }])
                const url = URL.createObjectURL(file);
                setSource(url);
            }
        }
    };
    const getRemoveImage = (x) => {
        setOldImage([
            ...oldImage,
            x
        ]
        )
    }
    const handleConditionChange = () => {
        setCheckboxHandle(!checkboxHandle);
    };
    const { handleBlur, handleSubmit, handleChange, values, setValues } =

        useFormik({
            initialValues: {
                name: "",
                part_no: "",
                price: "",
                b2b_price: "",
                any_discount: "",
                brand_id: "",
                item_stock: "",
                sku_id: "",
                weight: "",
                segment_type: "",
                min_qty: "",
                unit: "",
                point: "",
                tax_rate: "",
                hsn_code: "",
                return_days: "",
                return_policy: ""
            },
            onSubmit: async (val̥ues) => {
                dispatch(openLoader(true));
                let formData = new FormData();
                let AxiosFetch;

                for (let data in values) {
                    formData.append(data, values[data]);
                }
                let filteredData = fieldPairs.map(function (obj) {
                    return { item_count: +obj.item_count, bulk_discount: +obj.bulk_discount, product_id: +values.product_id };
                });
                formData.append('bulkData', JSON.stringify(filteredData));

                oldImage?.forEach((image) => {
                    if (!image?.file) {
                        formData.append(`deleted_image`, image.product_image);
                    }
                })

                if (images && images.length > 0) {
                    const imagesToSend = images.map((image) => {
                        if (image?.file) {
                            return image.file;
                        } else if (image?.video) {
                            return image.video;
                        }
                    });
                    imagesToSend.forEach((file, index) => {
                        formData.append(`new_image`, file);
                    });
                }
                formData.append("segment", JSON.stringify(segmentName))
                if (editData) {
                    AxiosFetch = await AxiosFetchMethod({
                        url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-product`,
                        method: "put",
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
                    });
                    editData = null
                }
                else {
                    AxiosFetch = await AxiosFetchMethod({
                        url: `${process.env.REACT_APP_BASE_URL}/api/create/create-product`,
                        method: "post",
                        data: formData,
                        headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
                    });
                }
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

    const sparePartBrand = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/all-brand-for-model`,
            headers: { Authorization: brToken },
        });
        setSparePart(data)
    }

    const handleAddFields = () => {
        setFieldPairs([...fieldPairs, { id: Date.now(), item_count: '', bulk_discount: '' }]);
    };

    const handleRemoveFields = (id) => {
        setFieldPairs(fieldPairs.filter((pair) => pair.id !== id));
    };

    const handleInputChange = (id, fieldName, value) => {
        const updatedPairs = fieldPairs.map((pair) => {
            if (pair.id === id) {
                return { ...pair, [fieldName]: value };
            }
            return pair;
        });
        setFieldPairs(updatedPairs);
    };

    const vehicleSegment = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/vehicle-segment-type`,
            headers: { Authorization: brToken },
        });
        setVehicleSegments(data)
    }

    const handleNameGet = (event) => {
        const {
            target: { value },
        } = event;
        setSegmentName(value)

    }
    console.log(segmentName, "mmmmmmmm");
    return (
        <>
            <Stack spacing={2} direction="row">
                <h1 className="btnName">Product</h1>
                <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    onClick={() => { handleOpen(); sparePartBrand() }}
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
                <Box className={Styles.style3}>
                    <div className="modal_title">
                        <h2> Add New Product</h2>
                    </div>
                    <hr />
                    <form className="catagories_form catagories_form2"
                        onSubmit={handleSubmit}
                    >
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <div >
                                    <ImageUploading
                                        multiple
                                        value={images}
                                        onChange={onChange}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps,
                                        }) => (
                                            // write your building UI

                                            <div className="upload__image-wrapper">
                                                <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <button
                                                            style={isDragging ? { color: 'red' } : undefined}
                                                            onClick={onImageUpload}
                                                            type='button'
                                                            {...dragProps}
                                                            className='DropdownImage'
                                                        >
                                                            <div className='uploadIcon'>
                                                                <img src={Upload} alt='_Upload' />
                                                            </div>
                                                            <div>   Drag and drop Files here</div>
                                                            <div>Or</div>
                                                            <div className='imageUploadbtn'>Brower Files</div>
                                                        </button>
                                                        {conditional ? <button type="button" onClick={() => { onImageRemoveAll(); setConditional(false) }} className='DraganRemoveAll'>Remove all images</button> : null}
                                                    </div>

                                                    <div className='vedioUpload'>
                                                        <input
                                                            // ref={inputRef}
                                                            className="VideoInput_input"
                                                            type="file"
                                                            name='vedio'
                                                            disabled={videoDisable}
                                                            onChange={handleFileChange}
                                                            accept=".mov,.mp4"
                                                        />
                                                        <div className='uploadIcon'>
                                                            <img src={Upload} alt='_Upload' />
                                                        </div>
                                                        <h2>Upload Vedio </h2>
                                                        <div>or</div>
                                                        <div type='button' className='vedioUploder'
                                                            onChange={handleFileChange}>Brower Here</div>
                                                    </div>
                                                </div>
                                                <Swiper
                                                    spaceBetween={20}
                                                    slidesPerView={5}
                                                    scrollbar={{ draggable: true }}
                                                    modules={[Autoplay, Pagination, Navigation]}
                                                >
                                                    {imageList?.map((image, index) => {

                                                        return (
                                                            <SwiperSlide key={index} >
                                                                <div className="image-item">
                                                                    {image?.product_image ? <LazyLoadImage
                                                                        alt="_blank"
                                                                        src={`${process.env.REACT_APP_BASE_URL}/upload/products/${image?.product_image}`} // use normal <img> attributes as props
                                                                        effect="blur"
                                                                        style={{ margin: "1rem 0 .5rem 0" }}
                                                                    /> : null}

                                                                    {image?.file ? <LazyLoadImage
                                                                        alt="_blank"
                                                                        src={image['data_url']} // use normal <img> attributes as props
                                                                        effect="blur"
                                                                        style={{ margin: "1rem 0 .5rem 0" }}
                                                                    /> : null}


                                                                    {!image?.video ? <div className="image-item__btn-wrapper">
                                                                        <button onClick={() => onImageUpdate(index)} type="button" className='DragnUpdate'>Change</button>
                                                                        <button onClick={() => { onImageRemove(index); getRemoveImage(image); }} type="button" className='DragnRemove'>Remove</button>
                                                                    </div> : null}
                                                                </div>
                                                            </SwiperSlide>
                                                        )
                                                    })}

                                                </Swiper>
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                                {source && (
                                    <video
                                        className="VideoInput_video"
                                        width="50%"
                                        height="250px"
                                        controls
                                        src={source}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <label htmlFor="name">Name</label>
                                <input type='text' id='name' placeholder='Name' name='name' onChange={handleChange} value={values.name} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="name">Part number</label>
                                <input type='text' id='part_number' placeholder='Part number' name='part_no' onChange={handleChange} value={values.part_no} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="price">Price</label>
                                <input type='number' name='price' placeholder='Price' id='price' onChange={handleChange} value={values.price} onBlur={handleBlur} />
                            </Grid>
                            <Grid item xs={6}>
                                <label htmlFor="b2b_price">B2B Price</label>
                                <input type='number' name='b2b_price' placeholder='B2B Price' id='b2b_price' onChange={handleChange} value={values.b2b_price} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="bulk_discount">Bulk_discount</label>
                                <input type='number' name='bulk_discount' placeholder='Bulk Price' id='bulk_discount' onClick={handleClickOpen} />

                                <Dialog
                                    open={bulkDiscount}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    onClose={handleCloseModal}
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle sx={{ fontSize: "2rem" }}>{"Bulk Discount"}</DialogTitle>

                                    <DialogContent>

                                        {fieldPairs.map((pair, index) => {
                                            return (
                                                <div key={index} className="catagories_form catagories_form2 catagories_form3">
                                                    <Grid item xs={6}>
                                                        <input
                                                            type="text"
                                                            placeholder='Item Count'
                                                            required
                                                            value={pair.item_count}
                                                            onChange={(e) => handleInputChange(pair.id, 'item_count', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <input
                                                            type="text"
                                                            placeholder='Bulk Discount'
                                                            value={pair.bulk_discount}
                                                            onChange={(e) => handleInputChange(pair.id, 'bulk_discount', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <button className='bulk-remove-btn' onClick={() => handleRemoveFields(pair.id)}><CloseIcon /></button>
                                                </div>
                                            )
                                        })}
                                    </DialogContent>
                                    <DialogActions>
                                        <div
                                            className="modal_btn2"
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
                                                onClick={handleAddFields}
                                                // onClick={handleCloseModal}
                                                className="btn_main2"
                                            >
                                                Create A new Feild
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    border: "2px solid #1B4B66",
                                                    '&:hover': {
                                                        border: "2px solid #1B4B66",
                                                    }
                                                }}
                                                onClick={handleCloseModal}
                                                className="btn_main2"
                                            >
                                                Close
                                            </Button>
                                            <Button variant="contained" className="btn_main" type="submit" onClick={handleCloseModal}
                                            // endIcon={<SendIcon />}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </DialogActions>
                                </Dialog>
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="anyDiscount">Any Discount? (Optional)</label>
                                <input type='number' placeholder='Any Discount' name='any_discount' id='anyDiscount' onChange={handleChange} value={values.any_discount} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="chooseCategory">Choose Brand</label>
                                <CustomSelect name='brand_id' value={values.brand_id} sx={{ fontSize: "1.3rem" }} id='brand_id' onBlur={handleBlur} onChange={handleChange} fullWidth >
                                    <CustomMenuItem sx={{ fontSize: "1.5rem" }} >---/Select/---</CustomMenuItem>
                                    {sparePart?.map((data, index) => {
                                        return (
                                            <CustomMenuItem key={data.id} value={data.id} sx={{ fontSize: "1.4rem" }}>{data.name}</CustomMenuItem>
                                        )
                                    })}

                                </CustomSelect>
                            </Grid>
                            <Grid item xs={6}>
                          <label htmlFor="vehicle_type">Vehicle-segment</label> 
                                <FormControl fullWidth sx={{marginTop:".5rem"}}>
                                    <InputLabel id="demo-multiple-checkbox-label">Vehicle-segment</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={segmentName}
                                        onChange={handleNameGet}
                                        input={<OutlinedInput label="Vehicle-segment" />}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {vehicleSegments?.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>
                                                <Checkbox checked={segmentName.includes(item?.name)} />
                                                <ListItemText primary={item.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>

                        <br />
                        <div className="modal_title modal_title2">
                            <h2>Invertory & Order Details</h2>
                        </div>
                        <hr />
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label htmlFor="stockCount">Item Stock Count</label>
                                <input type='number' placeholder='Item Stock' name='item_stock' id='stockCount' onChange={handleChange} value={values.item_stock} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="sku">SKU ID</label>
                                <input type='text' name='sku_id' id='sku' onChange={handleChange} placeholder='Sku id' value={values.sku_id} onBlur={handleBlur} />
                            </Grid>

                            <Grid item xs={6}>
                                <Grid container spacing={1}>
                                    <Grid item xs={7}>
                                        <label htmlFor="delieveryWeight">Product Unit</label>
                                        <input type='number' name='weight' id='delieveryWeight' placeholder='Product Unit' onChange={handleChange} value={values.weight} onBlur={handleBlur} />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <label htmlFor="delieveryWeight">Unit</label>
                                        <CustomSelect
                                            name="unit"
                                            value={values.unit}
                                            sx={{ fontSize: "1.3rem", padding: "0", width: "100px" }}
                                            onBlur={handleBlur}
                                            onChange={handleChange}  >
                                            <CustomMenuItem disabled sx={{ fontSize: "1.5rem" }}>---/Select/---</CustomMenuItem>
                                            <CustomMenuItem value="grams" sx={{ fontSize: "1.4rem" }}>Grams</CustomMenuItem>
                                            <CustomMenuItem value="kilograms" sx={{ fontSize: "1.4rem" }}>Kilograms</CustomMenuItem>
                                            <CustomMenuItem value="liter" sx={{ fontSize: "1.4rem" }}>Liter</CustomMenuItem>
                                        </CustomSelect>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="min_qua">Minimum Quantity</label>
                                <input type='number' name='min_qty' id='min_qua' onChange={handleChange} placeholder='Minimum Quantity' value={values.min_qty} onBlur={handleBlur} />
                            </Grid>



                        </Grid>

                        <br />
                        <div className="modal_title modal_title2">
                            <h2>Points</h2>
                        </div>
                        <hr />
                        <br />
                        <br />
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <label htmlFor="points">Points</label>
                                <input type='text' name='point' placeholder='Points' id='points' onChange={handleChange} value={values.point} onBlur={handleBlur} />
                            </Grid>
                        </Grid>

                        <br />
                        <div className="modal_title modal_title2">
                            <h2>Tax Information</h2>
                        </div>
                        <hr />
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label htmlFor="taxRate">Tax Rate(%)</label>
                                <CustomSelect name='tax_rate' value={values.tax_rate} id='taxRate' onBlur={handleBlur} onChange={handleChange} fullWidth >
                                    <CustomMenuItem value={0} disabled sx={{ fontSize: "1.6rem" }}>---/Select/---</CustomMenuItem>
                                    {gst?.map((data, index) => {
                                        return (
                                            <CustomMenuItem key={index} value={data.toString()} sx={{ fontSize: "1.4rem" }}>{`${data}%`}</CustomMenuItem>
                                        )
                                    })}

                                </CustomSelect>
                            </Grid>

                            <Grid item xs={6}>
                                <label htmlFor="hsn">hsn Code</label>
                                <input type='text' name='hsn_code' placeholder='Hsn Code' id='hsn' onChange={handleChange} value={values.hsn_code} onBlur={handleBlur} />
                            </Grid>
                        </Grid>
                        <br />
                        <div className="modal_title modal_title2">
                            <h2>Shipping & Return</h2>
                        </div>
                        <hr />
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            {/* <Grid item xs={6}>
                                <label htmlFor="ship_days">Shipping time in days</label>
                                <input type='number' name='ship_days' placeholder='Shipping Time in days' id='ship_days' onChange={handleChange} value={values.ship_days} onBlur={handleBlur} />
                                <span>Leave this box Empty if you want to use default tax </span>
                            </Grid> */}

                            <Grid item xs={6}>
                                <label htmlFor="return_period">Return period in days</label>
                                <input type='number' placeholder='Return period in Days' name='return_days' id='return_period' onChange={handleChange} onBlur={handleBlur} value={values.return_days} disabled={checkboxHandle} style={checkboxHandle ? { backgroundColor: "#80808054" } : null} />

                                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                                    <CustomCheckbox onClick={handleConditionChange} sx={{ padding: 0 }} id='checkBox' />
                                    <label htmlFor="checkBox">Check this if it is Returnable Item</label>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <label htmlFor="policy">Write Return Policy</label>
                                <textarea
                                    type="type"
                                    name="return_policy"
                                    id="policy"
                                    onChange={handleChange}
                                    value={values.return_policy}
                                    placeholder='Write Return Policy...................................'
                                    onBlur={handleBlur}
                                />
                                <span>Leave this box empty if you want to use default return policy </span>
                            </Grid>
                        </Grid>


                        <div
                            className="modal_btn2"
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
                </Box >
            </Modal >





        </>
    )
}
