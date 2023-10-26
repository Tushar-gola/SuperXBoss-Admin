import React from 'react';
import Logo from '../images/logo.svg';
import { Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import GradingIcon from '@mui/icons-material/Grading';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoIcon from '@mui/icons-material/Info';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import QuizIcon from '@mui/icons-material/Quiz';
export const NavSlide =({ open, onClose }) => {
    let navigate = useNavigate();
    const [state, setState] = React.useState({
        top: false,
    });
    const user = JSON.parse(localStorage.getItem("user"));
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const links = [

        {
            title: 'Dashboard',
            route: 'dashboard',
            icon: <DashboardCustomizeIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'Categories',
            route: '/categories',
            icon: <AddToPhotosIcon />,
            // authorizedPersons: [1, 2, 3, 4], 
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'brands',
            route: 'brands',
            icon: <BrandingWatermarkIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'Product List',
            route: 'products',
            icon: <ProductionQuantityLimitsIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'orders',
            route: 'orders',
            icon: <GradingIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'Users',
            route: 'users',
            icon: <PeopleAltIcon />,
            // authorizedPersons: [1],
            arrow: <KeyboardArrowRightIcon />
        },

        {
            title: 'customers',
            route: 'customers',
            icon: <PersonOutlineIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },

        {
            title: 'Notification',
            route: 'notification',
            icon: <NotificationAddIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'FAQ',
            route: 'faq',
            icon: <QuizIcon />,
            // authorizedPersons: [1, 2, 3, 4],
            arrow: <KeyboardArrowRightIcon />
        }
    ]
    const adminPermission = [
        {
            title: 'roles permissions',
            route: 'role-permissions',
            icon: <AdminPanelSettingsIcon />,
            // authorizedPersons: [1],
            arrow: <KeyboardArrowRightIcon />
        }, {
            title: 'Recharge Offer',
            route: 'wallet-offer',
            icon: <CurrencyRupeeIcon />,
            // authorizedPersons: [1, 2, 3, 4], 
            arrow: <KeyboardArrowRightIcon />
        }, {
            title: 'Shipping',
            route: 'shipping',
            icon: <LocalShippingIcon />,
            // authorizedPersons: [1, 2, 3, 4], arrow: <KeyboardArrowRightIcon />
        }, {
            title: 'Coupon',
            route: 'coupon',
            icon: <LocalOfferIcon />,
            // authorizedPersons: [1], 
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'Information',
            route: 'information',
            icon: <InfoIcon />,
            // authorizedPersons: [1], 
            arrow: <KeyboardArrowRightIcon />
        },
        {
            title: 'Banner',
            route: 'banner',
            icon: <ViewCarouselIcon />,
            // authorizedPersons: [1], 
            arrow: <KeyboardArrowRightIcon />
            
        },
    ]

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 280, position: "relative" }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}

        >
            <List>
                <ListItemIcon sx={{
                    mt: '2rem',
                    mb: '3rem',
                    display: "flex",
                    justifyContent: "center"

                }}>
                    <img src={Logo} alt="" />
                </ListItemIcon>
                {
                    links.map((text, index) => {
                        return (
                            <Link to={text.route} key={index} onClick={onClose}>
                                <ListItem disablePadding className="navbarLink">
                                    <ListItemButton>
                                        <ListItemIcon className='navIcon'>
                                            {text.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text.title} className='NavBarText' sx={{
                                            color: "black",
                                            fontWeight: 400,
                                            fontFamily: 'Roboto, sans-serif',
                                            lineHeight: '2.4rem',
                                            textTransform: "uppercase"

                                        }} />
                                    </ListItemButton>
                                    <ListItemIcon className='navIcon navIcon2'>
                                        {text.arrow}
                                    </ListItemIcon>
                                </ListItem>
                            </Link>
                        )})}
                {
                    user?.id === 1 ?
                        adminPermission.map((text, index) => {
                            return (
                                <Link to={text.route} key={index} onClick={onClose}>
                                    <ListItem disablePadding className="navbarLink">
                                        <ListItemButton>
                                            <ListItemIcon className='navIcon'>
                                                {text.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text.title} className='NavBarText' sx={{
                                                color: "black",
                                                fontWeight: 400,
                                                fontFamily: 'Roboto, sans-serif',
                                                lineHeight: '2.4rem',
                                                textTransform: "uppercase"

                                            }} />
                                        </ListItemButton>
                                        <ListItemIcon className='navIcon navIcon2'>
                                            {text.arrow}
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                            )
                        }) : null
                }




                <ListItem disablePadding key="11" className="navbarLink" onClick={() => {
                    localStorage.clear();
                    navigate("/SignIn")
                }}>
                    <ListItemButton>
                        <ListItemIcon className='navIcon'>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="LOGOUT" className='NavBarText' sx={{
                            color: "black",
                            fontWeight: 400,
                            fontFamily: 'Roboto, sans-serif',
                            lineHeight: '2.4rem',
                            textTransform: "uppercase"

                        }} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </Box >
    );

    return (
        <>
            {['left'].map((anchor) => (
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
