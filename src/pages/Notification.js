import React, { useEffect, useState } from "react";
import NotificationModal from "../components/modals/notification/NotificationModal"
import Addcatagories from "../../src/components/modals/catagories/Addcatagories";
import { faList, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../components/modals/catagories/ImageModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AxiosFetchMethod from "../utils/AxiosInstance";
import RetrieveData from '../utils/RetrieveData';
import CustomTable from "../helpers/CustomTable";
import { useNavigate } from "react-router-dom";
import { openLoader } from "../actions/index";
import { Grid, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import moment from "moment/moment";


export default function Notification() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reload, setReload] = useState(false);
    const [totalPages, setTotalPages] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const handleChangeRowsPerPage = (event) => setRowsPerPage(+event.target.value);

    return (
        <div>

            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={3}>
                        <NotificationModal
                            reload={reload}
                            setReload={setReload}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* {totalPages && (
                <CustomTable
                    rowData={catagriesDataRetrive}
                    columns={catagoriesColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )} */}
        </div>
    )
}
