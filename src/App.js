import React from 'react'
import './App.css';
import { Routers } from './Routes';
import { Loader } from './components';
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button';
import { SnackbarProvider } from 'notistack';
import {IsOnlinePopup} from "./utils"
function App() {
  const mySt̥ate = useSelector((state) => state.loaderWorking)
  const snackbarProvider = React.useRef();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
    setTimeout(() => {
      setIsOnline(true);
    }, 10000);
  };


  return (
    <>
      {mySt̥ate ? <Loader /> : null}
      {!isOnline ? <IsOnlinePopup /> : null}
      <SnackbarProvider
        ref={snackbarProvider}
        anchorOrgin={{ horizontal: "center", vertical: "bottom" }}
        maxSnack={5}
        style={{ fontSize: "1.5rem", fontWeight: 400, fontFamily: "Roboto' sans-serif" }}
        action={
          (snackbarId) => (
            <Button size='large' color='inherit' onClick={() => snackbarProvider.current.closeSnackbar(snackbarId)}>Dismiss</Button>
          )}
      >
        <Routers />
      </SnackbarProvider>


    </>
  );
}

export default App;
