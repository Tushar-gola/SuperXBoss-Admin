import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter
} from "react-router-dom";
import store from './store';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  // Your custom theme settings
  // For example:
  palette: {
    primary: {
      main: '#80808064', // Change this to your desired primary color
    }
  },
  status: {
    danger: " #1B4B66",
  },

  components: {
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#1b4b664b', // Change this to your desired color
        },
        barColorPrimary: {
          backgroundColor: '#1B4B66', // Change this to your desired color
        },
      },
    },

  }

});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>

);

