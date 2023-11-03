/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { FormControlLabel, Switch, Box, Grid } from "@mui/material";
import {AxiosFetchMethod, RetrieveData} from "../utils";
import { CustomTable } from "../helpers";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import moment from "moment/moment";
import { SearchField, SelectSearch } from '../components';
export const Customer = () => {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(null);
    const [reload, setReload] = React.useState();
    const [userData, setUserData] = React.useState([]);
    const dispatch = useDispatch();
    React.useEffect(() => {
        try {
            userDataRetreive();
        } catch (e) {
            console.error(e.message, "user page");
        }
    }, [rowsPerPage, page, reload]);

    const userColumns = [
        { id: "id", label: "#id" },
        {
            id: "profile_picture",
            label: "Profile Photo",
            renderCell: (parms) => {
                return (
                    <button className="modalImgBtn">
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/customer/${parms?.profile_picture}`} alt="_blank" />
                    </button>
                );
            },
        },
        {
            id: "first_name", label: "Name", renderCell: (parms) => {

                return (
                    <div>  {`${parms?.first_name?.charAt(0)?.toUpperCase() + parms?.first_name?.slice(1) + " " + parms?.last_name?.charAt(0)?.toUpperCase() + parms?.last_name?.slice(1)}`}</div>
                );
            },
        },
        { id: "mobile", label: "Mobile" },
        { id: "state", label: "State" },
        { id: "type", label: "Type" },
        { id: "gst_no", label: "Gst No" },
        { id: "business_type", label: "Business type" },
        { id: "business_name", label: "Business name" },
        { id: "business_contact_no", label: "Business contact no" },
        {
            id: "createdAt",
            label: "Create At",
            renderCell: (parms) => {
                return moment(parms?.createdAt).format(" MMMM Do YYYY, h:mm A");
            },
        },
        {
            id: "status",
            label: "Status",
            renderCell: (parms) => {
                return parms.status ? (
                    <div className="active" style={{ width: "90px" }}>Active</div>
                ) : (
                    <div className="pending" style={{ width: "90px" }}>Pending</div>
                );
            },
        },
        {
            id: "action",
            label: "Action",
            renderCell: (parms) => {

                return (
                    <>
                        <FormControlLabel
                            control={<Switch size="small" checked={parms?.status} sx={{
                                span: {
                                    span: {
                                        color: "#1B4B66"
                                    }
                                }
                            }} />}
                            onClick={() => handleChecked(parms?.id, parms?.status)}
                        />


                    </>
                );
            },
        },
    ];

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };
    const handleChecked = async (id, status) => {
        dispatch(openLoader(true));
        let data = await AxiosFetchMethod({
            method: "put",
            url: `${process.env.REACT_APP_BASE_URL}/api/update/customer-status-update`,
            data: { id, status },
        });
        if (data) {
            setReload(!reload)
            dispatch(openLoader(false))
        }

    }

    const userDataRetreive = async () => {

        dispatch(openLoader(true))
        let {
            data
        } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/customer-retrieve`,
            params: { page, limit: rowsPerPage },
        });
        if (data) {
            setUserData(data?.rows);
            setTotalPages(data?.count);
            dispatch(openLoader(false))
        }
    };

    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-customer-panel`,
            params: { page, limit: rowsPerPage, value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setUserData(data?.rows);
            setTotalPages(data.rows?.length)
        } else {
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

    return (
        <>


            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Customer using name" keyId="name" />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Customer using number" keyId="mobile" />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Customer using state" keyId="state" />
                    </Grid>
                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} state={false} area={true} label="Status" KeyId="status" />
                    </Grid>
                </Grid>
            </Box>


            <CustomTable
                rowData={userData}
                columns={userColumns}
                totalPages={totalPages}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
            />


        </>
    );
}
