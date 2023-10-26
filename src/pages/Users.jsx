/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Grid, Box, FormControlLabel, Switch, Menu, MenuItem } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { RetrieveData, AxiosFetchMethod } from "../utils";
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import { CustomTable } from "../helpers";
import moment from "moment/moment";
import { UserCreate, AssignPermission } from "../components";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { isAppendRow } from "../functions";
export const Users = () => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(null);
  const [reload, setReload] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [userId, setUserId] = React.useState()
  const [editUserData, setEditUserData] = React.useState()
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [assignPermission, setAssignPermission] = React.useState(false)
  const dispatch = useDispatch();
  let token = localStorage.getItem("token");
  let brToken = `Bearer ${token}`;
  const ITEM_HEIGHT = 25;
  const [anchorEl, setAnchorEl] = React.useState(null)


  const open = Boolean(anchorEl);
  React.useEffect(() => {
    try {
      userDataRetreive();
    } catch (e) {
      console.log(e.message, "user page");
    }
  }, [rowsPerPage, page, reload]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const options = [
    {
      label: "Edit",
      onClick: () => { setEditModalOpen(true) }
    },
    {
      label: "Assign Permission",
      onClick: () => { setAssignPermission(true) }
    },
    {
      label: "Write a Note"
    }
  ];

  const userColumns = [
    {
      id: "profile_picture",
      label: "Profile Photo",
      renderCell: (parms) => {
        return (
          <button className="modalImgBtn">
            <img src={`${process.env.REACT_APP_BASE_URL}/upload/user/${parms?.profile_picture}`} alt='_blank' />
          </button>
        );
      },
    },
    { id: "name", label: "Name" },
    { id: "mobile", label: "Mobile" },
    { id: "whats_app", label: "Whatsapp" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    {
      id: "createdAt",
      label: "Create At",
      renderCell: (parms) => {
        return moment(parms.createdAt).format(" MMMM Do YYYY, h:mm A");
      },
    },
    {
      id: "status",
      label: "Status",
      renderCell: (parms) => {
        return parms.status ? (
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
          <>
            <FormControlLabel
              control={<Switch size="small" checked={parms.status} sx={{
                span: {
                  span: {
                    color: "#1B4B66"
                  }
                }
              }} />}
              onClick={() => userActInativ(parms.id, parms.status)}
            />

            <Tooltip title="List">
              <IconButton style={{ padding: 5 }} sx={{ color: "#000000" }}
                onClick={(event) => { handleClick(event); setUserId(parms.id); setEditUserData(parms) }}
              >
                <MoreVertIcon fontSize='large'
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true" />
              </IconButton>
            </Tooltip>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  minHeight: ITEM_HEIGHT * 4.5,
                  width: '20rem',
                  border: "1px dotted grey",
                  boxShadow: "none"
                },
              }}
            >
              {options.map((option, index) => (
                <MenuItem key={index}
                  onClick={() => getValue(option.label, parms.id)}
                  className='ProductList'>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      },
    },
  ];
  const getValue = (data, id) => {
    options.find(o => o?.label === data).onClick(data);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  const userDataRetreive = async () => {
    dispatch(openLoader(true))
    let {
      data
    } = await RetrieveData({
      method: "get",
      url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/retrieve-user`,
      headers: { Authorization: brToken },
      params: { page, limit: rowsPerPage },
    });
    if (data) {
      setUserData(data?.rows);
      setTotalPages(data?.count);
      dispatch(openLoader(false))
    }
  };

  const userActInativ = async (id, status) => {
    dispatch(openLoader(true));
    let AxiosFetch = await AxiosFetchMethod({
      url: `${process.env.REACT_APP_BASE_URL}/api/update/user-details-update`,
      method: "put",
      data: { id, status },
      headers: { Authorization: brToken },
    });
    if (AxiosFetch.type === "success") {
      isAppendRow(setUserData, AxiosFetch.data)
      dispatch(openLoader(false));
    } else if (AxiosFetch.type === "error") {
      dispatch(openLoader(false));
    } else {
      dispatch(openLoader(false));
    }
  };
  return (
    <>
      <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
        <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
          <Grid item xs={4}>
            <UserCreate editModalOpen={editModalOpen} closeEditModal={() => setEditModalOpen(false)} id={userId} userEditData={editUserData} reload={reload} setReload={setReload} setEditUserData={setEditUserData} setUserData={setUserData} />
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

      <AssignPermission modalOpen={assignPermission} modalClose={() => { setAssignPermission(false); setEditUserData(false) }} id={userId} />
    </>
  );
}
