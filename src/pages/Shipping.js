import React, { useEffect, useState } from 'react'
import ShippingModal from '../components/modals/shipping/ShippingModal';
import { Grid, Box } from "@mui/material";
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomTable from "../helpers/CustomTable";
import RetrieveData from '../utils/RetrieveData';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";

export default function Shipping() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reload, setReload] = useState(false)
    const [shippingEditModal, setShippingEditModal] = useState(false)
    const [shippingEditdata, setShippingEditdata] = useState()
    const dispatch = useDispatch();
    const [shipping, setShipping] = useState(null)
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    useEffect(() => {
        ShippingDataRetrieve()
    }, [page, rowsPerPage, reload])

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const shippingColumn = [
        {
            id: "id", label: "#id"
        },
        {
            id: "state", label: "State"
        },
        {
            id: "shippingPrice", label: "Shipping Price"
        },
        {
            id: "action", label: 'Action', renderCell: (parms) => {
                return (
                    <div className="catagories_edit">
                        <button
                            className="edit_catagries"
                            style={{ padding: ".5rem" }}
                            onClick={() => {
                                setShippingEditModal(true);
                                setShippingEditdata(parms);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1b4b66fc" />
                        </button>

                    </div>
                );
            },
        },
    ]

    const ShippingDataRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/shipping-state-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });

        if (data) {
            dispatch(openLoader(false));
            setTotalPages(data?.count)
            setShipping(data?.rows)

        }
    }


    return (
        <>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={3}>
                        <ShippingModal reload={reload} setReload={setReload} editData={shippingEditdata} modalOpen={shippingEditModal} modalClose={() => setShippingEditModal(false)} setShippingEditdata={setShippingEditdata} />
                    </Grid>
                </Grid>
            </Box>


            {totalPages && (
                <CustomTable
                    rowData={shipping}
                    columns={shippingColumn}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    orderSty={true}
                />
            )}
        </>
    )
}
