import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
export const Loader =() => {

    return (
        <Box sx={{ width: '100%' }} className="loader_main">
            <LinearProgress sx={{ height: ".8rem" }} />
        </Box>
    )
}
