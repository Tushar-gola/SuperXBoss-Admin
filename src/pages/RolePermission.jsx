/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Box, Tooltip, FormControlLabel, Switch } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {AddRolePermission, AddRole} from '../components';
import {CustomTable} from "../helpers";
import {AxiosFetchMethod, RetrieveData} from "../utils";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import { isAppendRow } from '../functions';


export const RolePermission = () => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(null);
    const [Roles, setRoles] = useState([])
    const [openRolePermission, setOpenRolePermission] = useState(false)
    const [roleData, setRoleData] = useState(null)
    const dispatch = useDispatch();
    useEffect(() => {
        roleRetrieve()
    }, [page, rowsPerPage])

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
        try {
            dispatch(openLoader(true));
            let data = await AxiosFetchMethod({
                url: `${process.env.REACT_APP_BASE_URL}/api/update/role-status`,
                method: "put",
                data: { id: id, status: status },
            });
            if (data) {
                isAppendRow(setRoles, data.data)
                dispatch(openLoader(false));
            } else {
                dispatch(openLoader(false));
            }
        } catch (error) {
            console.error("An error occurred:", error);
            dispatch(openLoader(false));
        }
    }
    
    const roleRetrieve = async () => {
        try {
            dispatch(openLoader(true));
            const response = await RetrieveData({
                method: "get",
                url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/roles-retrieve`,
                params: { page, limit: rowsPerPage },
            });

            const { data } = response;

            if (data) {
                setRoles(data.rows);
                setTotalPages(data.count);
            }
            dispatch(openLoader(false));
        } catch (error) {
            console.error("An error occurred:", error);
            dispatch(openLoader(false));
        }
    };


    return (
        <>
            <Box sx={{ flexGrow: 1, px: '2.8rem', }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={4}>
                        <AddRole setRoles={setRoles} />
                    </Grid>
                </Grid>
            </Box>
          
                <CustomTable
                    rowData={Roles}
                    columns={RoleColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
           

            <AddRolePermission modalOpen={openRolePermission} modalClose={() => { setOpenRolePermission(false) }} RoleData={roleData} />
        </>
    )
}
