import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  Alert  from '@mui/material/Alert';
import HikingIcon from '@mui/icons-material/Hiking';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Login.css'
import { UserRoles } from '../../lib/common/UserRoles'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Hike Tracking
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a1a1a'
        }
    }
});

export default function LoginForm(props) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

  useEffect(()=>{
    setErrorMessage('');
  }, [])


const handleSubmit = async (event) => {
    event.preventDefault();

    // const data = event.currentTarget;
    setErrorMessage('');
    const credentials = { email, password };
    let valid = true;
    if(email.trim().length===0 || password.trim().length===0){
      setErrorMessage('Incorrect username or password');
      setShow(true);
      valid = false;
    }
    if (valid) {
        props.login(credentials, setShow, setErrorMessage);
    } else {
        setErrorMessage('Incorrect username or password');
        setShow(true);
    }
};


if (props.user?.role === UserRoles.HIKER ||
  props.user?.role === UserRoles.LOCAL_GUIDE ||
  props.user?.role === UserRoles.PLATFORM_MANAGER ||
  props.user?.role === UserRoles.HUT_WORKER ||
  props.user?.role === UserRoles.EMERGENCY_OPERATOR) {
  navigate("/")
}
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid 
          className = 'login-side'
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{backgroundColor: '#fcf3e2'}}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <HikingIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                type = "email"
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
              />
              {/*
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
        />*/}
        {
            show?
            <Alert variant="outlined" severity="error" onClose={() => {setErrorMessage(''); setShow(false)}}>{errorMessage}</Alert> : <></>
        }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Go back
                  </Link>
    </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

