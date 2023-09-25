import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    height: "100px"

};



export default function IsOnlinePopup() {


    return (
        <div>
            <Modal
                open={true}
                // onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    {/* <h2 id="parent-modal-title">Network connection</h2> */}
                    <Alert severity="warning" sx={{ fontSize: "1.4rem", height: "100%" }}>
                        <AlertTitle sx={{ fontSize: "2rem" }}>Warning - Network connection</AlertTitle>
                        Your network connection is down. — <strong>Please check your internet connection.!</strong>
                    </Alert>
                    {/* <p id="parent-modal-description">
                        Your network connection is down. Please check your internet connection.
                    </p> */}
                    {/* <ChildModal /> */}
                </Box>
            </Modal>
        </div>
    );
}