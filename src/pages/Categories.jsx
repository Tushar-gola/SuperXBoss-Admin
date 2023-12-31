/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Addcatagories, SearchField, SelectSearch, ImageModal } from "../components";
import { faList, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Grid, Box, FormControlLabel, Switch } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { CustomTable } from "../helpers";
import { RetrieveData, AxiosFetchMethod } from '../utils';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { isAppendRow } from "../functions";
export const Categories = React.memo(() => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalImage, setModalImage] = useState(false);
    const [catagriesDataRetrive, setCatagriesDataRetrive] = useState([]);
    const [catUserId, setCatUserId] = useState();
    const [editRowData, setEditRowData] = useState(false);
    const [catRowSingleData, setCatRowSingleData] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'))
    const handleChangeRowsPerPage = (event) => setRowsPerPage(+event.target.value);
    const catagoriesColumns = [
        {
            id: "icon",
            label: "Photo",
            renderCell: (parms) => {
                return (
                    <button className="modalImgBtn" onClick={() => {
                        setCatUserId(parms?.id)
                        setModalImage(true)
                    }}>
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/categories/${parms?.icon}`} alt="_blank" />
                    </button>
                );
            },
        },
        { id: "name", label: "Name" },
        {
            id: "featured",
            label: "Featured",
            renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms?.featured}`}
                        onClick={() => pagePost(parms?.id, parms?.featured)}
                    />
                );
            },
        },
        {
            id: "user", label: "Create By", renderCell: (parms) => {
                return <div>{parms?.user?.name || user?.name}</div>
            },
        },
        {
            id: "createdAt",
            label: "CreateAt",
            renderCell: (parms) => {
                return moment(parms?.createdAt).format(" MMMM Do YYYY, h:mm A");
            },
        },
        {
            id: "status",
            label: "Status",
            renderCell: (parms) => {
                return parms?.status ? (
                    <div className="active">Active</div>
                ) : (
                    <div className="pending">Pending</div>
                );
            },
        },
        {
            id: "action",
            label: "Action",
            renderCell: (parms) => {
                return (
                    <div className="catagories_edit">
                        <button
                            className="edit_catagries"
                            style={{ padding: ".5rem" }}
                            onClick={() => {
                                setEditRowData(true);
                                setCatRowSingleData(parms);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1b4b66fc" />
                        </button>
                        <Link to={`/categories/sub-categories/${parms.id}`}>
                            <button
                                title="Sub Catagries"
                                style={{ padding: ".5rem" }}
                            >
                                <FontAwesomeIcon icon={faList} size="lg" />
                            </button>
                        </Link>

                        <FormControlLabel
                            control={<Switch size="small" checked={parms.status} sx={{
                                span: {
                                    span: {
                                        color: "#1B4B66"
                                    }
                                }
                            }} />}
                            onClick={() => handleSwitch(parms.id, parms.status)}
                        />
                    </div >
                );
            },
        },
    ];
    const catagoriesRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/maincategories`,
            params: { page, limit: rowsPerPage }
        });
        if (data) {
            setCatagriesDataRetrive(data?.rows);
            setTotalPages(data?.count);
            dispatch(openLoader(false));
        } else {
            dispatch(openLoader(false));
        }
    };
    const getData = async (value) => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-category-panel`,
            params: { page, limit: rowsPerPage, value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setCatagriesDataRetrive(data?.rows);
            setTotalPages(data.rows?.length)
        }
    };
    const debounce = (func, time) => {
        let Timer;
        return (...args) => {
            clearTimeout(Timer)
            Timer = setTimeout(() => {
                func(args)
            }, time)
        }
    };
    const debounceGetData = debounce(getData, 2000);
    const updateCategory = async (id, data) => {
        dispatch(openLoader(true));
        try {
            const response = await AxiosFetchMethod({
                url: `${process.env.REACT_APP_BASE_URL}/api/update/edit-category`,
                method: "put",
                data: { catId: id, ...data },
            });
            if (response.type === "success") {
                isAppendRow(setCatagriesDataRetrive, response.data);
            }
        } catch (error) {
            console.error("Error updating data:", error);
        } finally {
            dispatch(openLoader(false));
        }
    };
    
    const handleSwitch = (id, status) => {
        updateCategory(id, { statusId: status }, "switch");
    };
    
    const pagePost = (id, featuredId) => {
        updateCategory(id, { featuredId: featuredId }, "page");
    };
    useEffect(() => {
        catagoriesRetrieve()
    }, [page, rowsPerPage])
    return (
        <>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={2}>
                        <Addcatagories
                            editRowData={editRowData}
                            setEditRowData={setEditRowData}
                            catRowSingleData={catRowSingleData}
                            setCatRowSingleData={setCatRowSingleData}
                            setCatagriesDataRetrive={setCatagriesDataRetrive}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find category using name" keyId="name" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Status" KeyId="status" />
                    </Grid>
                </Grid>
            </Box>


            <CustomTable
                rowData={catagriesDataRetrive}
                columns={catagoriesColumns}
                totalPages={totalPages}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
            />


            <ImageModal
                modalOpen={modalImage}
                modalClose={() => setModalImage(false)}
                catUserId={catUserId}
                setCatagriesDataRetrive={setCatagriesDataRetrive}
            />
        </>
    );
})
