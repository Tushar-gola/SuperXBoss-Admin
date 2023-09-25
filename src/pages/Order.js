import React, { useEffect, useState } from 'react'
import { Grid, Box, FormControlLabel, Switch } from "@mui/material";
import CustomTable from "../helpers/CustomTable";
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import moment from 'moment/moment';
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RetrieveData from '../utils/RetrieveData';
import OrderDetails from '../components/modals/order/OrderDetails';
import SearchField from '../components/SearchField';
import SelectSearch from '../components/SelectSearch';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Order() {
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [reload, setReload] = useState(false)
    const [order, setOrder] = useState()
    const [date, setDate] = React.useState(null);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    const [getOrderId, setGetOrderId] = useState()
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    useEffect(() => {
        OrderDataRetrieve()
    }, [page, rowsPerPage, reload])

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    console.log(date);

    const orderColumns = [
        { id: "id", label: "#Id" },
        { id: "name", label: 'Name' },
        { id: "order_id", label: 'Order Id' },
        { id: "mobile", label: 'Mobile' },
        { id: "pin_code", label: "Pin code" },
        { id: "street_address", label: 'Address' },
        { id: "city", label: 'City' },
        { id: "state", label: 'State' },
        { id: "address_type", label: 'Address Type' },
        { id: "transction_id", label: 'Transaction Id' },
        { id: "user_id", label: 'User Id' },
        { id: "discount", label: 'Discount' },
        { id: "total_amount", label: 'Total Amount' },
        { id: "status", label: 'Status' },
        { id: "ship_charge", label: 'Ship Charge' },
        {
            id: "createdAt", label: 'Create At', renderCell: (parms) => {
                return moment(parms.createdAt).format(" MMMM Do YYYY, h:mm A");
            },
        },
        // {
        //     id: "status", label: 'Status', renderCell: (parms) => {
        //         return parms.status ? (
        //             <div className="active">Active</div>
        //         ) : (
        //             <div className="pending">Pending</div>
        //         );
        //     },
        // },
        {
            id: "action", label: 'Action', renderCell: (parms) => {
                return (
                    <div className="catagories_edit">

                        <button
                            onClick={() => { console.log(parms.order_id); setOpen(true); setGetOrderId(parms?.order_id) }}
                            disabled={!(parms.type === "purchase")}
                        >
                            <FontAwesomeIcon icon={faList} size="lg" />
                        </button>
                    </div>
                );
            },
        },
    ];


    const OrderDataRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/orders-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });
        if (data) {
            dispatch(openLoader(false));
            setTotalPages(data?.count)
            setOrder(data?.rows)
        }
    }



    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-category-panel`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage, value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setOrder(data?.rows);
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

            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find order using name" keyId="name" />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find order using Order id" keyId="order_id" />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find order using mobile" keyId="mobile" />
                    </Grid>

                    <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}  >
                            <DemoContainer components={['DatePicker']} sx={{ padding: "0" }}>
                                <DatePicker value={date} disablePast onChange={(newValue) => { setDate(newValue?.$d) }} sx={{
                                    width: "100%",
                                    input: { border: 0, padding: "1.65rem 1.5rem", fontSize: "1.4rem" },
                                    '& input:focus': {
                                        border: 0,
                                        boxShadow: "none"
                                    }, label: { fontSize: "1.9rem", fontWeight: 400 }
                                }} inputFormat="MM/dd/yyyy" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Box>

            {totalPages && (
                <CustomTable
                    rowData={order}
                    columns={orderColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    orderSty={true}
                />
            )}

            <OrderDetails open={open} onClose={() => setOpen(false)} order_id={getOrderId} />
        </>
    )
}
