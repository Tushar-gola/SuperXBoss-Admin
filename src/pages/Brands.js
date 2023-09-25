import React, { useEffect, useState } from 'react';
import BrandDetailsModal from '../components/modals/Brands/BrandDetailsModal';
import { BrandImageModal } from '../components/modals/Brands/BrandImageModal';
import { faPenToSquare, faList } from '@fortawesome/free-solid-svg-icons'
import { Grid, Box, FormControlLabel, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AxiosFetchMethod from '../utils/AxiosInstance';
import CustomTable from "../helpers/CustomTable";
import RetrieveData from '../utils/RetrieveData';
import { useNavigate } from "react-router-dom";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import SearchField from '../components/SearchField';
import SelectSearch from '../components/SelectSearch';
import moment from 'moment/moment';
export default function Brands() {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [modalImage, setModalImage] = useState(false)
    const [brandData, setBrandData] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [reload, setReload] = useState(false)
    const [brandEditData, setBrandEditData] = useState(null)
    const [brandEditModalOpen, setBrandEditModalOpen] = useState(false)
    const [brandId, setBrandId] = useState(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const brandColumns = [
        {
            id: "logo", label: 'Image', renderCell: (parms) => {
                return (
                    <button className="modalImgBtn" onClick={() => {
                        setBrandId(parms.id)
                        setModalImage(true)
                    }}>
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/brands/${parms.logo}`} />
                    </button>
                );
            },
        },
        { id: "name", label: 'Name' },
        {
            id: "featured", label: 'Feartured', renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms.featured}`}
                        onClick={() => pagePost(parms.id, parms.featured)}
                    />
                );
            },
        },
        { id: "type", label: 'type' },
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
                                setBrandEditModalOpen(true);
                                setBrandEditData(parms);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1b4b66fc" />
                        </button>

                        <button
                            disabled={parms.type === 'Spare Parts'}
                            title={parms.type === 'Spare Parts' ? "Disable" : null}
                            style={{ padding: ".5rem" }}
                            onClick={() => GoBrandPage(parms.id)}
                        >
                            <FontAwesomeIcon icon={faList} size="lg" />
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

    const GoBrandPage = (id) => {
        dispatch(openLoader(true));
        if (id) {
            dispatch(openLoader(false));
            navigate("/vehicle", { state: id });
        }
    }

    const BrandDataRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/main-brands-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });
        if (data) {
            dispatch(openLoader(false));
            setTotalPages(data?.count)
            setBrandData(data?.rows)
        }
    }

    useEffect(() => {
        BrandDataRetrieve()
    }, [page, rowsPerPage, reload])


    const pagePost = async (id, featured) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod(
            {
                url: `${process.env.REACT_APP_BASE_URL}/api/update/brand-featured`,
                method: "put",
                data: { id: id, featuredId: featured },
                headers: { Authorization: brToken },
            });
        if (AxiosFetch) {
            dispatch(openLoader(false));
            setReload(!reload)
        }
    }


    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/brand-status`,
            method: "put",
            data: { brandId: id, statusId: status },
            headers: { Authorization: brToken },
        });
        if (AxiosFetch) {
            dispatch(openLoader(false));
            setReload(!reload)
        }
    }


    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-brand-panel`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage, value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setBrandData(data?.rows);
            setTotalPages(data.rows?.length)
        }
    }

    const debounce = (func, time) => {
        let Timer;
        return (...args) => {
            clearTimeout(Timer)
            Timer = setTimeout(() => {
                func(args)
            }, time)
        }
    }
    const debounceGetData = debounce(getData, 2000);
    return (

        <>
            <Box sx={{ flexGrow: 1, px: '2.8rem', }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={1}>
                        <BrandDetailsModal setReload={setReload} reload={reload} brandEditData={brandEditData} setBrandEditData={setBrandEditData} setBrandEditModalOpen={setBrandEditModalOpen} brandEditModalOpen={brandEditModalOpen} />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Brand using name" keyId="name" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Status" KeyId="status" />
                    </Grid>
                </Grid>
            </Box>

            {totalPages && (
                <CustomTable
                    rowData={brandData}
                    columns={brandColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )}


            {/* Modal */}

            <BrandImageModal modalOpen={modalImage} modalClose={() => setModalImage(false)} brandId={brandId} reload={reload} setReload={setReload} />


        </>
    );
}