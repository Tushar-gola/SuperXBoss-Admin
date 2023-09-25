import React, { useState, useEffect } from 'react'
import CatagoriesModal from '../components/modals/productModals/CatagoriesModal';
import VehicleModal from '../components/modals/productModals/VehicleModal';
import CreateProduct from '../components/modals/productList/CreateProduct'
import BrandModal from '../components/modals/productModals/BrandModal';
import { Grid, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AxiosFetchMethod from "../utils/AxiosInstance";
import SelectSearch from '../components/SelectSearch';
import SearchField from '../components/SearchField';
import IconButton from '@mui/material/IconButton';
import CustomTable from "../helpers/CustomTable";
import RetrieveData from '../utils/RetrieveData';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import moment from "moment/moment";
const ITEM_HEIGHT = 48;

export default function Product() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(null);
    const [openBrandModal, setOpenBrandModal] = useState(false);
    const [openVehicleModal, setOpenVehicleModal] = useState(false)
    const [openCategoryModal, setOpenCategoryModal] = useState(false)
    const [vehicleBrandData, setVehicleBrandData] = useState()
    const [vehicleEditModalOpen, setVehicleEditModalOpen] = useState(false)
    const [vehicleEdit, setVehicleEdit] = useState()
    const [productData, setProductData] = useState(null)
    const [vehicleData, setVehicleData] = useState(null)
    const [productId, setProductId] = useState({})
    const [reload, setReload] = useState(false);
    const handleChangeRowsPerPage = (event) => setRowsPerPage(+event.target.value);
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;

    useEffect(() => {
        productRetrieve()
    }, [page, rowsPerPage, reload])

    const options = [
        {
            label: "Brands",
            onClick: () => { setOpenBrandModal(true); }
        },
        {
            label: "Vehicle",
            onClick: () => { setOpenVehicleModal(true) }
        },
        {
            label: "Catagries",
            onClick: () => { setOpenCategoryModal(true) }
        },
        {
            label: "SubCatagries"
        },

    ];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-product-panel`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage, value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setProductData(data?.rows);
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

    const productColumns = [
        {
            id: "logo",
            label: "Photo",
            renderCell: (parms) => {
                return (
                    <button className="modalImgBtn">
                        <img src={`${process.env.REACT_APP_BASE_URL}/upload/products/${parms.productImage[0]?.product_image}`} />
                    </button>
                );
            },
        },
        { id: "name", label: "Name" },
        {
            id: "brand", label: "Brand", renderCell: (parms) => {
                return (parms?.brand?.name)
            }
        },
        { id: "price", label: "Price" },
        { id: "part_no", label: "Part number" },
        { id: "b2b_price", label: "B2B_Price" },
        {
            id: "segment", label: "Vehicle Segments", renderCell: (parms) => {
                return (parms?.segment?.name)
            } },

        {
            id: "trend_part", label: "Trend", renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms?.trend_part}`}
                        onClick={() => pagePost(parms?.id, parms?.trend_part)}
                    />
                );
            },
        }, {
            id: "new_arrival", label: "New Arrival", renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms?.new_arrival}`}
                        onClick={() => pagePostArrival(parms?.id, parms?.new_arrival)}
                    />
                );
            },
        }, {
            id: "pop_item", label: "Popular Item", renderCell: (parms) => {
                return (
                    <StarBorderIcon
                        sx={{ fontSize: 30 }}
                        className={`featured-${parms?.pop_item}`}
                        onClick={() => pagePostPopItem(parms?.id, parms?.pop_item)}
                    />
                );
            },
        },
        { id: "item_stock", label: "Item_stock" },
        { id: "tax_rate", label: "Tax_Rate" },
        { id: "weight", label: "Weight" },
        { id: "unit", label: "Unit" },
        { id: "hsn_code", label: "HSN_Code" },
        { id: "point", label: "Points" },

        {
            id: "createdAt",
            label: "CreateAt",
            renderCell: (parms) => {
                return moment(parms?.createdAt).format(" MMMM Do YYYY, h:mm A");
            },
        },
        {
            id: "action",
            label: "Action",
            renderCell: (parms) => {
                return (
                    <React.Fragment>
                        {/* <Tooltip title="Delete">
                            <IconButton style={{ padding: 5 }}>
                                <DeleteIcon fontSize='large' sx={{ color: "#000000" }} />
                            </IconButton>
                        </Tooltip> */}


                        <Tooltip title="Edit">
                            <IconButton onClick={() => { setVehicleEdit(parms); setVehicleEditModalOpen(true) }}>
                                <BorderColorIcon fontSize='large' sx={{ color: "#000000" }}

                                />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="List">
                            <IconButton style={{ padding: 5 }} sx={{ color: "#000000" }} onClick={(event) => { handleClick(event); setProductId(parms?.id); setVehicleEdit(parms) }}>
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
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
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
                                <MenuItem key={index} onClick={() => getValue(option.label)} className='ProductList'>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </React.Fragment>
                );
            },
        },
    ];
    const getValue = (data, id) => {
        options.find(o => o?.label === data).onClick(data);
        if (data === "Brands") {
            brandRetrieve()
        }
        vehicleRetrieve()
        handleClose()
    }

    const productRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/product-retrieve`,
            headers: { Authorization: brToken },
            params: { page, limit: rowsPerPage }
        });
        if (data) {
            dispatch(openLoader(false));
            setProductData(data?.rows);
            setTotalPages(data?.count)
        }
    }

    const pagePost = async (id, trendId) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/product-trend-status`,
            method: "put",
            data: { id: id, trend_part: trendId },
            headers: { Authorization: brToken },
        });
        if (AxiosFetch.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload);
        }
    };

    const pagePostArrival = async (id, arrival) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/product-trend-status`,
            method: "put",
            data: { id: id, new_arrival: arrival },
            headers: { Authorization: brToken },
        });
        if (AxiosFetch.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload);
        }
    };

    const pagePostPopItem = async (id, popular_item) => {
        dispatch(openLoader(true));
        let AxiosFetch = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/product-trend-status`,
            method: "put",
            data: { id: id, pop_item: popular_item },
            headers: { Authorization: brToken },
        });
        if (AxiosFetch.type === "success") {
            dispatch(openLoader(false));
            setReload(!reload);
        }
    };

    const brandRetrieve = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/vehicle-brand`,
            headers: { Authorization: brToken },
        });
        setVehicleBrandData(data)
    }

    const vehicleRetrieve = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/product-brand-vehicle?product_id=${productId}`,
            headers: { Authorization: brToken },
        });
        setVehicleData(data)
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, px: '2.8rem', }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={1.5} >
                        <CreateProduct editData={vehicleEdit} setEditData={setVehicleEdit} editModalOpen={vehicleEditModalOpen} editModalClose={() => setVehicleEditModalOpen(false)} reload={reload} setReload={setReload} />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find product using name" keyId="productName" />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find product product number" keyId="part_no" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={true} segment={false} label="Brand" KeyId="brandId" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={true} label="Vehicle Segments" KeyId="segment" />
                    </Grid>
              
                    <Grid item xs={2} >
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Trend" KeyId="trend" />
                    </Grid>

                    <Grid item xs={2} >
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="New Arrival" KeyId="arrival" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Popular Item" KeyId="pop" />
                    </Grid>
                </Grid>
            </Box>

            {totalPages && (
                <CustomTable
                    rowData={productData}
                    columns={productColumns}
                    totalPages={totalPages}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                />
            )}

            <BrandModal modalOpen={openBrandModal} modalClose={() => { setOpenBrandModal(false) }} data={vehicleBrandData} id={productId} productData={vehicleEdit} />

            <VehicleModal modalOpen={openVehicleModal} modalClose={() => { setOpenVehicleModal(false) }}
                id={productId} data={vehicleData} productData={vehicleEdit} />

            <CatagoriesModal modalOpen={openCategoryModal} modalClose={() => { setOpenCategoryModal(false) }} />

        </>
    )
}
