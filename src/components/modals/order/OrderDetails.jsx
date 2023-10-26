import React from 'react';
import { Box, Drawer, Divider, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
export const OrderDetails =({ open, onClose, order_id }) => {
    const [state, setState] = React.useState({
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 600, position: "relative" }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}

        >
            <Grid container spacing={2} className='order-slide'>
                <Grid item xs={12}>
                    <h1 className='order-title'>Order Summary</h1>
                </Grid>
            </Grid>

            <Grid container spacing={2} className='order-slide'>
                <Grid item xs={12}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="demo-simple-select-filled-label" sx={{ fontSize: "1.6rem" }}>Order Progress</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                        // value={age}
                        // onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>New</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "2rem", padding: " 0 2rem " }} className='order-slide'>

                <Grid item xs={6}>
                    <img src="" className='order-img' alt='_blank'/>
                </Grid>

                <Grid item xs={6} sx={{textAlign:"center"}}>
                    <h1>Break</h1>
                    <span>2000</span>
                </Grid>
                <Grid item xs={6} >
                    <img src="" className='order-img' alt='_blank'/>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <h1>Break</h1>
                    <span>2000</span>
                </Grid>

                <Grid item xs={6}>
                    <img src="" className='order-img' alt='_blank'/>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <h1>Break</h1>
                    <span>2000</span>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: "3rem", padding: "0 2rem" }} className='order-slide'>
                <Grid item xs={6}>
                    <h2 className='order-charges-name'>Delivered Charge</h2>
                </Grid>
                <Grid item xs={1}>
                    <h1>:</h1>
                </Grid>
                <Grid item xs={5}>
                    <h3 className='order-charges'>200</h3>
                </Grid>
            </Grid>
            <Divider />
        </Box >
    );


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
