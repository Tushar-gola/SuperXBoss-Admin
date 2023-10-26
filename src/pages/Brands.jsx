/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BrandDetailsModal, BrandImageModal, SearchField, SelectSearch } from '../components';
import { faPenToSquare, faList } from '@fortawesome/free-solid-svg-icons'
import { Grid, Box, FormControlLabel, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CustomTable } from "../helpers";
import { RetrieveData, AxiosFetchMethod } from '../utils';
import { useNavigate } from "react-router-dom";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import moment from 'moment/moment';
import { isAppendRow } from '../functions';
export const Brands = () => {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [modalImage, setModalImage] = useState(false)
    const [brandData, setBrandData] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [reload, setReload] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))
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
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/brands/${parms?.logo}`} alt='_blank' />
                    </button>
                );
            },
        },
        { id: "name", label: 'Name' },
        {
            id: "brand_day", label: 'Brand Day', renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms.brand_day}`}
                        onClick={() => pagePost(parms.id, parms.brand_day)}
                    />
                );
            },
        },
        { id: "type", label: 'type' },
        { id: "brand_day_offer", label: 'Brand Day Offer' },
        {
            id: "user_id", label: 'Create By', renderCell: (parms) => {
                return <div>{parms?.user?.name || user?.name}</div>

            }
        },
        {
            id: "createdAt", label: 'Create At', renderCell: (parms) => {
                return moment(parms?.createdAt).format(" MMMM Do YYYY, h:mm A");
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
        try {
            const { data } = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/main-brands-retrieve`,
                headers: { Authorization: brToken },
                params: { page, limit: rowsPerPage }
            });
            if (data) {
                dispatch(openLoader(false));
                setTotalPages(data?.count || 0);
                setBrandData(data?.rows || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            dispatch(openLoader(false));
        }
    };
    const getData = async (value) => {
        dispatch(openLoader(true));
        try {
            const { data } = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-brand-panel`,
                headers: { Authorization: brToken },
                params: { page, limit: rowsPerPage, value: value[0] }
            });
            if (data) {
                setBrandData(data.rows);
                setTotalPages(data.count);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            dispatch(openLoader(false));
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
    const updateBrand = async (id, data) => {
        dispatch(openLoader(true));
        try {
            const response = await AxiosFetchMethod({
                url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-brand`,
                method: "put",
                data: { brandId: id, ...data },
                headers: { Authorization: brToken },
            });
            if (response) {
                isAppendRow(setBrandData, response.data);
            }
        } catch (error) {
            console.error("Error updating data:", error);
        } finally {
            dispatch(openLoader(false));
        }
    };

    const handleSwitch = (id, status) => {
        updateBrand(id, { status: status });
    };

    const pagePost = (id, featured) => {
        updateBrand(id, { brand_day: featured });
    };

    useEffect(() => {
        BrandDataRetrieve()
    }, [page, rowsPerPage])

    return (

        <>
            <Box sx={{ flexGrow: 1, px: '2.8rem', }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={2}>
                        <BrandDetailsModal brandEditData={brandEditData} setBrandData={setBrandData} setBrandEditData={setBrandEditData} setBrandEditModalOpen={setBrandEditModalOpen} brandEditModalOpen={brandEditModalOpen} />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Brand using name" keyId="name" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Status" KeyId="status" />
                    </Grid>
                </Grid>
            </Box>

            <CustomTable
                rowData={brandData}
                columns={brandColumns}
                totalPages={totalPages}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
            />



            {/* Modal */}

            <BrandImageModal modalOpen={modalImage} modalClose={() => setModalImage(false)} brandId={brandId} reload={reload} setReload={setReload} />


        </>
    );
}