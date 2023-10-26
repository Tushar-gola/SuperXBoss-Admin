/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, Drawer, Divider, Grid, Button } from '@mui/material';
import { useFormik } from "formik";
import { AxiosFetchMethod, RetrieveData } from "../../../utils";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import SendIcon from '@mui/icons-material/Send';


export const UserEditSlider = ({ open, onClose }) => {
    const [state, setState] = React.useState({
        right: false,
    });
    const [reload, setReload] = React.useState(true)
    const [disable, setDisable] = React.useState(true)
    const [getProfileImage, setGetProfileImage] = React.useState({
        profileName: "",
        Url: ""
    })
    const dispatch = useDispatch();
    const [userData, setUserData] = React.useState([])
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    const userDataRetreive = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/login-user-retrieve`,
            headers: { Authorization: brToken }
        });
        if (data) {
            setUserData(data);
            let { name, profile_picture, role } = data
            let userDetails = { name: name, image: profile_picture, id: role }
            localStorage.setItem('user', JSON.stringify(userDetails));
        }
    };

    useEffect(() => {
        setValues({ name: userData?.name, mobile: userData?.mobile, email: userData?.email, whats_app: userData?.whats_app, address: userData?.address })
        userDataRetreive()
    }, [open, reload])

    useEffect(() => {
        setDisable(true)
        getProfileImage.profileName = ""
    }, [onClose])
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 450, position: "relative" }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}

        >
            <form onSubmit={handleSubmit}>
                <div className='section-userImage'>

                    <button className='userImage' type='button'>
                        {
                            !getProfileImage.profileName ? <img src={`${process.env.REACT_APP_BASE_URL}/upload/user/${userData?.profile_picture}`} alt='_blank' /> : <img src={getProfileImage.Url} alt='_blank'/>
                        }
                    </button>

                    <label htmlFor='profile'>Edit Profile <input type='file' onChange={(e) => {
                        setGetProfileImage({
                            profileName: e.target.files[0],
                            Url: URL.createObjectURL(e.target.files[0])
                        })
                    }} id='profile' /></label>
                </div>

                <div className='section-field catagories_form'>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <label htmlFor='name'>Name</label>
                            <input type="text" value={values.name || ''} disabled={disable} onChange={handleChange}
                                onBlur={handleBlur} name='name' />
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor='mobile'>Mobile</label>
                            <input type="text" value={values.mobile || ''} disabled={disable} onChange={handleChange}
                                onBlur={handleBlur} name='mobile' />
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor='address'>Address</label>
                            <input type="text" value={values.address || ''} disabled={disable} onChange={handleChange}
                                onBlur={handleBlur} name='address' />
                        </Grid>

                        <Grid item xs={12}>
                            <label htmlFor='whatsapp'>Whatsapp Number</label>
                            <input type="text" value={values.whats_app || ''} disabled={disable} onChange={handleChange}
                                onBlur={handleBlur} name='whats_app' />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor='email'>Email Id</label>
                            <input type="text" value={values.email || ''} disabled={disable} onChange={handleChange}
                                onBlur={handleBlur} name='email' />
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant='outlined' className="btn_main2" onClick={() => setDisable(false)} sx={{ marginRight: "1rem" }} >Edit Details</Button>
                            <Button variant="contained" className="btn_main" type="submit" disabled={disable} endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </form>
            <Divider />
        </Box >
    );
    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                name: "",
                mobile: "",
                whats_app: "",
                email: "",
                address: "",
            },
            onSubmit: async (values) => {
                dispatch(openLoader(true));
                let formData = new FormData();
                formData.append("profile_picture", getProfileImage.profileName)
                for (let data in values) {
                    formData.append(data, values[data]);
                }

                let AxiosFetch = await AxiosFetchMethod({
                    url: `${process.env.REACT_APP_BASE_URL}/api/update/user-details-update`,
                    method: "put",
                    data: formData,
                    headers: { Authorization: brToken },
                });
                console.log(AxiosFetch?.response?.data.type);
                if (AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        values.name = ''
                        values.address = ''
                        values.email = ""
                        values.whats_app = ""
                        values.mobile = ""
                        getProfileImage.profileName = ""
                        onClose()
                        setReload(!reload)
                        userDataRetreive()
                    }
                }
            }
        })

    return (
        <>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Drawer
                        anchor={anchor}
                        open={open}
                        onClose={onClose}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}

        </>
    )
}
