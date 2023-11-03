/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Grid, Box, FormControlLabel, Switch } from "@mui/material";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { SearchField, SelectSearch, CouponModal } from '../components/index'
import { AxiosFetchMethod, RetrieveData } from "../utils";
import { openLoader } from "../actions/index";
import { styled } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { isAppendRow } from '../functions';

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 18,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="red" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="17" width="17" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        backgroundColor: '#1B4B66',
        width: 16,
        height: 16,
        margin: 2,
    },
}));
export const Coupon = () => {
    const [reload, setReload] = React.useState(false)
    const [couponModalOpen, setCouponModalOpen] = React.useState(false)
    const [couponData, setCouponData] = React.useState([])
    const [modaldata, setModaldata] = React.useState(null)
    const dispatch = useDispatch();

    const CouponCard = ({ item }) => {
        const [copied, setCopied] = React.useState(false);
        const copyToClipboard = (code) => {
            navigator.clipboard.writeText(code);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 3000);
        };
        return (
            <Grid item xs={6} sm={4} md={4} className='coupon-grid'  >
                <div className="container">
                    <div className={`card card-${item?.status}`} >
                        <div className="main" style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>

                            <div className="content">
                                <h2>{item?.code}</h2>
                                <h1>{item?.amount} <span>Coupon</span></h1>
                                <p >Start {item?.start_date}</p>
                            </div>
                        </div>
                        <p style={{ color: "blue", padding: 0, margin: 0 }}>Valid till {item?.end_date}</p>
                        <div className="copy-button">
                            <div id="copyvalue" >{item?.code}</div>
                            <button onClick={() => copyToClipboard(item?.code)}>{!copied ? 'COPY' : 'COPYED'}</button>
                        </div>
                        <div className='tool'>
                            <div className='coupon-edit' onClick={() => { setModaldata(item); setCouponModalOpen(true) }}>
                                <ModeEditOutlineIcon sx={{ color: "#1B4B66", fontSize: "2.5rem" }} /> <span>Edit</span>
                            </div>
                            <FormControlLabel
                                control={<Android12Switch checked={item?.status} size="large" onClick={() => handleSwitch(item?.id, item?.status)} />}
                                label="Status" sx={{
                                    color: "#000", span: {
                                        fontSize: "1.5rem"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Grid>
        )
    }
    useEffect(() => {
        CouponRetrieve()
    }, [])

    const CouponRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/coupon-retrieve`,
        });
        if (data) {
            setCouponData(data)
            dispatch(openLoader(false));
        }
    }

    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let data = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/coupon-update`,
            method: "put",
            data: { id, status },
        });
        if (data) {
            isAppendRow(setCouponData, data.data)
            dispatch(openLoader(false));
            setReload(!reload);
        }
    };

    const getData = async (value) => {
        dispatch(openLoader(true));

        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/search-like-coupon-panel`,
            params: { value: value[0] }
        });
        if (data) {
            dispatch(openLoader(false));
            setCouponData(data?.rows);
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
        <div>
            <Box sx={{ flexGrow: 1, px: "2.8rem" }}>
                <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                    <Grid item xs={2}>
                        <CouponModal setCouponData={setCouponData} couponModalOpen={couponModalOpen} setCouponModalOpen={() => setCouponModalOpen(false)} modaldata={modaldata} setModaldata={setModaldata} />
                    </Grid>

                    <Grid item xs={2}>
                        <SearchField debounceGetData={debounceGetData} label="Find Coupon using code" keyId="code" />
                    </Grid>

                    <Grid item xs={2}>
                        <SelectSearch debounceGetData={debounceGetData} sparePart={false} segment={false} statusCheck={true} label="Status" KeyId="status" />
                    </Grid>


                </Grid>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: "2rem", marginBottom: "8rem" }}>
                {
                    couponData && couponData.map((item, index) => {
                        return (
                            <CouponCard item={item} key={index} />
                        )
                    })
                }
            </Grid >
        </div>
    )
}
