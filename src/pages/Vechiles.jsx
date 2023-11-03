/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Grid, Box, FormControlLabel, Switch } from "@mui/material";
import {CustomTable} from "../helpers";
import { RetrieveData, AxiosFetchMethod } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment/moment';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import { VechilesImageModal, VechilesModal } from '../components'
import { isAppendRow } from '../functions';
export const Vechiles = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0)
    const [rowData, setRowData] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [vehicleRowData, setVehicleRowData] = useState(null)
    const [modalImage, setModalImage] = useState(false);
    const [vehicleId, setVehicleId] = useState()
    const user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch();
    const loaction = useLocation();

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const vehicleData = [
        {
            id: "icon", label: 'Image', Width: 20, renderCell: (parms) => {
                return (
                    <button className="modalImgBtn" onClick={() => {
                        setVehicleId(parms.id)
                        setModalImage(true)
                    }}>
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/vehicle/${parms?.icon}`} alt='_blank'/>
                    </button>
                );
            },
        },
        { id: "name", label: 'Name' },
        {
            id: "user_id", label: 'Create By', renderCell: (parms) => {
                return <div>{parms?.user?.name || user.name}</div>

            }
        },
        {
            id: "createdAt", label: 'Create At', renderCell: (parms) => {
                return moment(parms.createdAt).format(" MMMM Do YYYY, h:mm A");
            },
        },
        {
            id: "status", label: 'Status', renderCell: (parms) => {
                return parms.status ? (
                    <div className="active">Active</div>
                ) : (
                    <div className="pending">Pending</div>
                );
            },
        },
        {
            id: "action", label: 'Action', renderCell: (parms) => {
                return (
                    <div className="catagories_edit">
                        <button
                            className="edit_catagries"
                            style={{ padding: ".5rem" }}
                            onClick={() => {
                                setEditModalOpen(true);
                                setVehicleRowData(parms);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                        </button>

                        <FormControlLabel
                            control={<Switch size="small" checked={parms.status}
                                sx={{
                                    span: {
                                        span: {
                                            color: "#1B4B66"
                                        }
                                    }
                                }}
                            />}
                            onClick={() => handleSwitch(parms.id, parms.status)}
                        />
                    </div>
                );
            },
        },
    ];

    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod(
            {
                url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-vehicle`,
                method: "put",
                data: { vehicleId: id, status: status },
            });

        if (AxiosFetch.type === "success") {
            isAppendRow(setRowData, AxiosFetch.data)
            dispatch(openLoader(false));
        } else if (AxiosFetch?.response?.data?.type === "error") {
            dispatch(openLoader(false));
        }
    }

    const vehicleRetrieve = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/vehicle-segments-retrieve`,
            params: { page, limit: rowsPerPage, brand_id: loaction.state }
        });
        setTotalPages(data?.count)
        setRowData(data?.rows)
    }
    useEffect(() => {
        try {
            vehicleRetrieve()
        } catch (e) {
            console.error(e.messgae, "Vechile Page");
        }
    }, [page, rowsPerPage])

    return (
        <>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={3}>
                        <VechilesModal
                            editRowData={editModalOpen} // modal open
                            setRowData={setRowData}
                            setEditRowData={setEditModalOpen}
                            RowSingleData={vehicleRowData}
                            setRowSingleData={setVehicleRowData}
                        />
                    </Grid>
                </Grid>
            </Box>

            <CustomTable
                rowData={rowData}
                columns={vehicleData}
                totalPages={totalPages}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
            />

            <VechilesImageModal
                modalOpen={modalImage}
                modalClose={() => setModalImage(false)}
                UserId={vehicleId}
                setRowData={setRowData}
            />

        </>
    )
}
