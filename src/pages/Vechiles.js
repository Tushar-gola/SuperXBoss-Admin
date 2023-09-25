import React, { useEffect, useState } from 'react'
import { Grid, Box, FormControlLabel, Switch } from "@mui/material";
import CustomTable from "../helpers/CustomTable";
import AxiosFetchMethod_2 from '../utils/RetrieveData';
import AxiosFetchMethod from '../utils/AxiosInstance';
import VechilesAdd from "../components/modals/vechiles/VechilesModal"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment/moment';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import VechilesImageModal from '../components/modals/vechiles/VechilesImageModal'
export default function Vechiles() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0)
    const [rowData, setRowData] = useState([])
    const [reload, setReload] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [vehicleRowData, setVehicleRowData] = useState(null)
    const [modalImage, setModalImage] = useState(false);
    const [vehicleId, setVehicleId] = useState()
    const dispatch = useDispatch();
    const loaction = useLocation();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

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
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/vehicle/${parms.icon}`} />
                    </button>
                );
            },
        },
        { id: "name", label: 'Name' },
        {
            id: "user_id", label: 'Create By', renderCell: (parms) => {
                return <div>{parms.user.name}</div>

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
                url: `${process.env.REACT_APP_BASE_URL}/api/update/vehicle-status`,
                method: "put",
                data: { vehicleId: id, statusId: status },
                headers: { Authorization: brToken },
            });

        if (AxiosFetch.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload)
        } else if (AxiosFetch?.response?.data?.type === "error") {
            dispatch(openLoader(false));
        }
    }

    const vehicleRetrieve = async () => {
        let { data: { count, rows } } = await AxiosFetchMethod_2({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/vehicle-segments-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage, brand_id: loaction.state }
        });
        setTotalPages(count ?? 0)
        setRowData(rows)
    }
    useEffect(() => {
        try {
            vehicleRetrieve()
        } catch (e) {
            console.log(e.messgae, "Vechile Page");
        }
    }, [page, rowsPerPage, reload])



    return (
        <>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={3}>
                        <VechilesAdd
                            editRowData={editModalOpen} // modal open
                            reload={reload} // Reload
                            setReload={setReload}  // Reload
                            setEditRowData={setEditModalOpen}
                            RowSingleData={vehicleRowData}
                            setRowSingleData={setVehicleRowData}
                        />
                    </Grid>
                </Grid>
            </Box>

            {totalPages && (
                <CustomTable
                    rowData={rowData}
                    columns={vehicleData}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )}

            <VechilesImageModal
                modalOpen={modalImage}
                modalClose={() => setModalImage(false)}
                UserId={vehicleId}
                reload={reload}
                setReload={setReload}
            />

        </>
    )
}
