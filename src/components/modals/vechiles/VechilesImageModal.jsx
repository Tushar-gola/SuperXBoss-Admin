/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Modal, Box } from "@mui/material";
import UploadIcon from "../../../images/icons8-upload-to-the-cloud-50.png";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import {AxiosFetchMethod} from "../../../utils";
import Styles from '../../../pages/style.module.css'
import SendIcon from '@mui/icons-material/Send';
export const VechilesImageModal = ({ modalOpen, modalClose, UserId, reload, setReload }) => {
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const maxSize = 800 * 1024; // 800kb in bytes

    const [currentCatData, UpdateCatData] = useState({
        vehicleId: UserId,
        vehicleImage: "",
        Url: ''
    });
    useEffect(() => {
        UpdateCatData({
            ...currentCatData,
            vehicleId: UserId
        })
    }, [UserId])

    const handleSubmit = (async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('image', currentCatData.vehicleImage)
        formData.append('id', currentCatData.vehicleId)
        dispatch(openLoader(true));

        let AxiosFetch = await AxiosFetchMethod(
            {
                url: `${process.env.REACT_APP_BASE_URL}/api/update/vehicle-image-upload`,
                method: "put",
                data: formData,
                headers: { "Content-Type": "multipart/form-data", Authorization: brToken },
            });
        if (AxiosFetch?.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload)
            UpdateCatData({
                ...currentCatData,
                Url: '',
                catagorniesImage: ""
            })
            modalClose();
        } else if (AxiosFetch?.response?.data?.type === "error") {
            dispatch(openLoader(false));
        }


    })

    return (
        <>
            <Modal
                open={modalOpen}
                onClose={modalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal"
            >
                <Box className={Styles.style}>
                    <div className="modal_title">
                        <h2>Create Vehicle</h2>
                    </div>
                    <hr />
                    <form className="catagories_form">
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
                                            UpdateCatData({
                                                ...currentCatData,
                                                vehicleImage: e.target.files[0],
                                                Url: URL.createObjectURL(e.target.files[0]),

                                            })
                                        }
                                    }}
                                />
                            </button>
                        </div>

                        <div className="output_catagories">
                            <img
                                src={currentCatData.Url ? currentCatData.Url : UploadIcon}

                                alt=""

                                style={currentCatData.Url ? { width: "100%", height: "100%" } : null}
                            />
                        </div>

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
                                    modalClose();
                                    UpdateCatData({
                                        ...currentCatData,
                                        Url: '',
                                        catagorniesImage: ""
                                    })
                                }}


                                className="btn_main2"
                            >
                                Close
                            </Button>
                            <Button variant="contained" className="btn_main" type='submit' onClick={(e) => {
                                handleSubmit(e)
                            }} endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    )
}
