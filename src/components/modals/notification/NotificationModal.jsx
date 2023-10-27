import React, { useEffect, useState } from "react";
import { Stack, Button, Dialog, Grid } from "@mui/material";
import { useFormik } from "formik";
import {AxiosFetchMethod} from "../../../utils";
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import Slide from '@mui/material/Slide';
import UploadIcon from "../../../images/icons8-upload-to-the-cloud-50.png";
import { MultiSelectUser } from "../../../components";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const NotificationModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [userDataId, setUserDataId] = React.useState([])
    const [notificationImage, setNotificationImage] = useState({
        notification: "",
        Url: ''
    })
    const maxSize = 800 * 1024; // 800kb in bytes
    const handleClose = () => {
        setOpen(false);
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

    const { handleBlur, handleSubmit, handleChange, values } =
        useFormik({
            initialValues: {
                title: "",
                id: "",
                description: ""
            },
            onSubmit: async (val̥ues) => {
                let formData = new FormData();
                values.id = JSON.stringify(userDataId)
                for (let data in values) {
                    formData.append(data, values[data]);
                }
                formData.append('image', notificationImage?.notification)
                let data = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/create/notification`,
                    method: "post",
                    data: formData,
                },{ "Content-Type": "multipart/form-data" });
                console.log(data);
            },
        });
    return (
        <div>
            <Stack spacing={2} direction="row" >
                <h1 className="btnName">Notification</h1>
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
                    <h2>Create Notification</h2>
                </div>
                <hr />
                <form className="catagories_form"
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            <div className="output_catagories">
                                <img
                                    src={notificationImage.Url ? notificationImage.Url : UploadIcon}

                                    alt=""

                                    style={notificationImage.Url ? { width: "100%", height: "100%" } : null}
                                />
                            </div>
                            <div>
                                <button className="upload_img">
                                    <p>Upload Image</p>
                                    <input
                                        type="file"
                                        title=""
                                        accept="Image/*"
                                        name="catagoriesImage"
                                        onChange={(e) => {
                                            if (e.target.files[0].size > maxSize) {
                                                alert('One or more images are larger than 800KB. Please choose smaller images.');
                                            } else {
                                                setNotificationImage({
                                                    ...notificationImage,
                                                    notification: e.target.files[0],
                                                    Url: URL.createObjectURL(e.target.files[0]),

                                                })
                                            }
                                        }}
                                    />
                                </button>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                // required
                                placeholder="Title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title} />
                        </Grid>

                        <Grid item xs={12}>
                            <MultiSelectUser userDataId={userDataId} setUserDataId={setUserDataId} />
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor="name">Description</label>
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
        </div >
    )
}
