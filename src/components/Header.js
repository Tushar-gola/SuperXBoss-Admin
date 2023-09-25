import React, { useEffect, useState } from 'react'
import Logo from '../images/logo.svg';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NavSlide from './NavSlide';
import { Link, Outlet } from 'react-router-dom';
import UserEditSlider from '../components/modals/users/UserEditSlider'
import '../App.css';

const pages = [
    {
        title: 'Dashboard',
        route: 'dashboard',
    }, {
        title: 'Product List',
        route: 'productlist',
    }, {
        title: 'Users',
        route: 'users',
    }, {
        title: 'customers',
        route: 'customers',
    }
]


export default function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [userEditSlider, setUserEditSlider] = React.useState(false);
    const [profile, setProfile] = useState(null)
    const [toggle, setToggle] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    useEffect(() => {
        const handleMouseMove = (e) => {
            // Mouse ke current position ko track karo
            const x = e.clientX;
            if (x <= 8 && x >= 0) {
                setToggle(true)
            } else if (x > 282) {
                setToggle(false)
            }
            // Mouse ke coordinates ko state mein update karo
        };

        // Mouse move event listener ko add karo
        window.addEventListener('mousemove', handleMouseMove);
        // Cleanup function
        return () => {
            // Mouse move event listener ko remove karo jab component unmount ho jaye
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    const settings = [
        {
            label: "Profile",
            onClick: () => { setUserEditSlider(true); handleCloseUserMenus() }
        }
    ]
    useEffect(() => {
        setProfile(user?.image)
    }, [user, profile, userEditSlider])

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting) => {
        if (setting) {
            settings.find(o => o?.label === setting).onClick(setting);
        }
    };
    const handleCloseUserMenus = (set) => {
        setAnchorElUser(null);
    };
    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: "white" }}>
                <Container maxWidth="xll">
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>

                        {/* Add Icon  */}
                        <button className="hamburger hamburger--spin " type="button" onClick={() => setToggle(true)} >
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>

                        <Typography
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                            }}

                        >
                            <img src={Logo} alt="" />
                        </Typography>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },

                            }}
                        >
                            <img src={Logo} alt="" />
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "center", gap: "3rem" }} >
                            {pages.map((page, index) => (
                                <Button
                                    key={index}
                                    className='header-titles'
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        display: 'block', fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '1.5rem',
                                        color: '#000',
                                    }}
                                    color="inherit">

                                    <Link to={page.route}> {page.title}</Link>
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user?.name?.toUpperCase()}
                                        src={`${process.env.REACT_APP_BASE_URL}/upload/user/${profile}`}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenus}
                            >
                                {settings.map((setting, index) => (
                                    <MenuItem key={index} onClick={() => handleCloseUserMenu(setting.label)}>
                                        <Typography textAlign="center" sx={{ fontSize: "1.5rem" }}>{setting.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar >
                </Container >
            </AppBar >
            <NavSlide open={toggle} onClose={() => setToggle(false)} />
            <UserEditSlider open={userEditSlider} onClose={() => setUserEditSlider(false)} />
            <Outlet />
        </>
    )
}
