import React from 'react'
import './App.css';
import Routers from '../src/Routes/Routers';
import Loader from '../src/components/Loader';
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button';
import { SnackbarProvider } from 'notistack';
import IsOnlinePopup from "../src/utils/IsOnlinePopup"
function App() {
  const mySt̥ate = useSelector((state) => state.loaderWorking)
  const snackbarProvider = React.useRef();



  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    // Add event listeners for online and offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners when the component unmounts
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
      {
        mySt̥ate ?
          <Loader />
          : null
      }

      {
        !isOnline ? <IsOnlinePopup /> : null
      }
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
