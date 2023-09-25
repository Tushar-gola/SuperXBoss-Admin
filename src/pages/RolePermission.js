import React, { useState, useEffect } from 'react'
import AddRolePermission from '../components/modals/rolePermission/AddRolePermission';
import { Grid, Box, Tooltip, FormControlLabel, Switch } from '@mui/material';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AddRole from '../components/modals/rolePermission/AddRole';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AxiosFetchMethod from "../utils/AxiosInstance";
import IconButton from '@mui/material/IconButton';
import RetrieveData from '../utils/RetrieveData';
import CustomTable from "../helpers/CustomTable";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";

export default function RolePemission() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(null);
    const [Roles, setRoles] = useState([])
    const [reload, setReload] = useState(false);
    const [openRolePermission, setOpenRolePermission] = useState(false)
    const [roleData, setRoleData] = useState(null)
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    useEffect(() => {
        try {
            roleRetrieve()
        } catch (e) {
            console.log(e.message, "Role Permission");
        }
    }, [page, rowsPerPage, reload])

    const RoleColumns = [
        { id: "id", label: "#Id" },
        { id: "name", label: "Role" },
        {
            id: "isActive",
            label: "Status",
            renderCell: (parms) => {
                return parms.isActive ? (
                    <div className="">Active</div>
                ) : (
                    <div className="">Pending</div>
                );
            },
        },
        {
            id: "action",
            label: "Action",
            renderCell: (parms) => {
                return (
                    <div className="catagories_edit">
                        <Tooltip title="Edit">
                            <IconButton style={{ padding: 5 }} onClick={() => { setOpenRolePermission(true); setRoleData(parms) }}>
                                <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1b4b66fc" />
                            </IconButton>
                        </Tooltip>

                        <FormControlLabel
                            control={<Switch size="small" checked={parms?.isActive} sx={{
                                span: {
                                    span: {
                                        color: "#1B4B66"
                                    }
                                }
                            }} />}
                            onClick={() => handleSwitch(parms?.id, parms?.isActive)}
                        />

                    </div>
                );
            },
        },
    ];

    const handleChangeRowsPerPage = (event) => setRowsPerPage(+event.target.value);

    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let data = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/role-status`,
            method: "put",
            data: { id: id, statusId: status },
            headers: { Authorization: brToken },
        });
        if (data) {
            dispatch(openLoader(false));
            setReload(!reload);
        }
    }
    const roleRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/roles-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });
        if (data) {
            dispatch(openLoader(false));
            setRoles(data?.rows)
            setTotalPages(data?.count);
        }
    }
    
    return (
        <>
            <Box sx={{ flexGrow: 1, px: '2.8rem', }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={4}>
                        <AddRole reload={reload} setReload={setReload} />
                    </Grid>
                </Grid>
            </Box>
            {totalPages && (
                <CustomTable
                    rowData={Roles}
                    columns={RoleColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )}

            <AddRolePermission modalOpen={openRolePermission} modalClose={() => { setOpenRolePermission(false) }} RoleData={roleData} />
        </>
    )
}
