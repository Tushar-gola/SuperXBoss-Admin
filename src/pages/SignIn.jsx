import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { openLoader } from "../actions/index";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { loginAdmin } from '../schemas/index'
import { enqueueSnackbar } from 'notistack'
import Lottie from 'lottie-react';
import Car from '../images/lottiFiles/animation_lmhn6mil.json'
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status.danger,
  '&.Mui-checked': {
    color: theme.status.danger,
  },

}));


// const defaultTheme = createTheme();
export const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [btnDisable, setBtnDisable] = React.useState(true)
  let navigation = useNavigate();
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const { handleBlur, handleSubmit, handleChange, touched, values, errors } = useFormik({
    initialValues: {
      name: '',
      password: ''
    },
    validationSchema: loginAdmin
    ,
    onSubmit: (values, action) => {
      dispatch(openLoader(true));
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/retrieve/authLogin`, values)
        .then(res => {
          dispatch(openLoader(false));
          navigation('/dashboard')
          values.name = ""
          values.password = ""
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res?.data?.user));
        }).catch((err) => {
          console.error(err);
          if (err?.response?.data.errors[0] == null) {
            dispatch(openLoader(false));
            enqueueSnackbar(err?.response?.data.message, { variant: "error" })
          }
        })
    }
  });
  return (
    <div className="signin" >
      <Grid container component="main" sx={{ width: "100%", margin: "auto", height: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className='img'
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >

          <Lottie
            animationData={Car}
            loop
            autoplay
          />
        </Grid>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#1B4B66" }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h2" variant="h3">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

              <FormControl sx={{ mt: "4rem", width: '100%' }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password1" error={errors?.name && touched?.name} sx={{ fontSize: "1.5rem" }}>Username</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password1"
                  type='text'
                  required
                  error={errors?.name && touched?.name}
                  label="Username"
                  name="name" onChange={handleChange} value={values.name.toLowerCase()} onBlur={handleBlur}
                  sx={{ fontSize: "1.2rem" }}
                  size="medium"
                />
                <div className='yup-error'>
                  {errors.name && touched.name ? <span className='err'>{errors.name}</span> : null}
                </div>
              </FormControl>


              <FormControl sx={{ mt: "3.2rem", width: '100%' }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" error={errors?.password && touched?.password} sx={{ fontSize: "1.5rem" }}>Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  // margin="normal"
                  required
                  label="Password"
                  error={errors?.password && touched?.password}
                  // fullWidth
                  // helperText="Incorrect entry."
                  name="password" onBlur={handleBlur} onChange={handleChange} value={values.password.toLowerCase()} placeholder='Enter Your Username'
                  sx={{ fontSize: "1.2rem" }}
                  size="medium"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize='large' /> : <Visibility fontSize='large' />}
                      </IconButton>
                    </InputAdornment>
                  }
                // label="Password"
                />
                <div className='yup-error'>
                  {errors.password && touched.password ? <span className='err'>{errors.password}</span> : null}
                </div>
              </FormControl>

              <FormControlLabel
                control={<CustomCheckbox value="remember" size='large' onChange={(e) => setBtnDisable(!e.target.checked)} />}
                label="Remember me" sx={{
                  color: "grey", marginTop: "1rem", span: {
                    fontSize: "1.5rem"
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                disabled={btnDisable}
                variant="contained" className="btn_main"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body1">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
    // </ThemeProvider>
  )
}