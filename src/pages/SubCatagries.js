import * as React from 'react';
import { Grid, Box, FormControlLabel, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import SubCataModal from '../components/modals/sub-Catagories/SubCataModal'
import AxiosFetchMethod from "../utils/AxiosInstance";
import moment from 'moment/moment';
import SubCategoryImageModal from '../components/modals//sub-Catagories/SubCategoryImageModal';
import CustomTable from "../helpers/CustomTable";
import RetrieveData from '../utils/RetrieveData';
import { Link, useNavigate } from "react-router-dom";
import { faList } from "@fortawesome/free-solid-svg-icons";
import SearchField from '../components/SearchField';
import SelectSearch from '../components/SelectSearch';
export default function SubCategories() {
    // ********************* Main States Starrt ******************************** 
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(null)
    const [subCatData, setSubCatData] = React.useState([])
    const [reload, setReload] = React.useState(false)
    const [subCatEditData, setSubCatEditData] = React.useState(null)
    const [editRowData, setEditRowData] = React.useState(false)
    const [catUserId, setCatUserId] = React.useState(false)
    const [modalOpen, setModalOpen] = React.useState(false)
    // ********************* Main States End ******************************** 
    const location = useLocation();
    const dispatch = useDispatch();
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
    };
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    const subCatagriesColumns = [
        {
            id: "icon", label: 'Photo', renderCell: (parms) => {

                return (
                    <button className="modalImgBtn" onClick={() => {
                        setCatUserId(parms.id)
                        setModalOpen(true)
                    }}>
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/categories/${parms.icon}`} />
                    </button>

                );
            },
        },
        { id: "name", label: 'Name' },
        {
            id: "user", label: "Create By", renderCell: (parms) => {
                return <div>{parms?.user?.name}</div>

            },
        },
        {
            id: "createdAt", label: 'CreateAt', renderCell: (parms) => {
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
            id: "action", label: 'Action',
            renderCell: (parms) => {
                return (
                    <div className="catagories_edit">
                        <button
                            className="edit_catagries"
                            style={{ padding: ".5rem" }}
                            onClick={() => {
                                setEditRowData(true);
                                setSubCatEditData(parms);
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                        </button>
                        <Link to={`/categories/sub-categories/${parms.id}`}>
                            <button
                                title="Sub Catagries"
                                style={{ padding: ".5rem" }}
                            // onClick={() => GoSubCatagrie(parms.id)}
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
                    </div>
                );
            },
        }
    ];
    let { id } = useParams();
    // ********************* SubCatagriesRetreive Data Retrevie Start ******************************** 

    const SubCatagriesRetreive = async () => {
        dispatch(openLoader(true));
        let { data: { rows, count } } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/subCategoriesRetrieve?catId=${+id}`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });
        if (rows) {
            setTotalPages(count ?? 0)
            setSubCatData(rows)
            dispatch(openLoader(false));
        }
    }
    React.useEffect(() => {
        try {
            SubCatagriesRetreive();
        } catch (e) {
            console.log(e.message, "Sub catagory page");
        }
    }, [rowsPerPage, page, reload, id])

    // ********************* SubCatagriesRetreive Data Retrevie End******************************** 

    // ********************* SubCatagriesRetreive Status Update Start******************************** 

    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod(
            {
                url: `${process.env.REACT_APP_BASE_URL}/api/update/statusUpdate`,
                method: "put",
                data: { catId: id, statusId: status },
                headers: { Authorization: brToken },
            });
        if (AxiosFetch?.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload)
        } else {
            dispatch(openLoader(false));
        }
    };

    // ********************* SubCatagriesRetreive Status Update End ******************************** 

    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-category-panel`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage, value: value[0], id: id }
        });
        if (data) {
            dispatch(openLoader(false));
            setSubCatData(data?.rows);
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
                    <Grid item xs={2}>
                        <SubCataModal reload={reload} setReload={setReload} subCatEditData={subCatEditData} editRowData={editRowData} setEditRowData={setEditRowData} setSubCatEditData={setSubCatEditData} />
                    </Grid>
                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Sub-category using name" keyId="subName" />
                    </Grid>
                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Status" KeyId="subStatus" />
                    </Grid>
                </Grid>
            </Box>


            {totalPages && (
                <CustomTable
                    rowData={subCatData}
                    columns={subCatagriesColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )}

            <SubCategoryImageModal catUserId={catUserId} modalOpen={modalOpen} modalClose={() => setModalOpen(false)} reload={reload} setReload={setReload} />

        </>
    );
}