import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import HikingIcon from '@mui/icons-material/Hiking';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'
import API from '../../API/API.js';
import {UserRoles} from '../../lib/common/UserRoles'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Hike Tracker
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

function SignUpForm(props) {

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [informationMessage, setInformationMessage] = useState('');
  const [showInformation, setShowInformation ] = useState(false);
  const [hutId, setHutId] = useState();
  const [listHuts, setListHuts] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setInformationMessage(false);
    let valid = true;
    if(firstName.trim().length=== 0 || lastName.trim().length===0 || email.trim().length===0 || password.trim().length===0){
      setErrorMessage('Please fill all the requested fields');
      setShow(true);
      valid = false;
    }else if(confirmPassword !== password){
      valid = false;
      setErrorMessage('Password do not match');
      setShow(true);
    } else if (valid) {
      let hutIds;
      if(role!==4){
        hutIds= null;
        const credentials = {email, firstName, lastName, password, role, phoneNumber};
        props.doRegister(credentials, setShow, setErrorMessage, setInformationMessage, setShowInformation);

      }else{
        hutIds = [hutId];
        const credentials = { email, firstName, lastName, password, role, phoneNumber, hutIds};
        props.doRegister(credentials, setShow, setErrorMessage, setInformationMessage, setShowInformation);

      }
      //const credentials = { email, firstName, lastName, password, role, phoneNumber, id};
     // const credentials = {email, firstName, lastName, password, role, phoneNumber};
      // props.doRegister(credentials, setShow, setErrorMessage, setInformationMessage, setShowInformation);
    }
  }

  React.useEffect(()=>{
    let loh = [];
   if(role===4){
            const getHuts = async ()=>{
     loh = await API.getListOfHuts();
  }
  getHuts().then(()=>{
    setListHuts(loh)
  })
    }
  }, [role])

  if (props.user?.role === UserRoles.HIKER ||
    props.user?.role === UserRoles.LOCAL_GUIDE ||
    props.user?.role === UserRoles.PLATFORM_MANAGER ||
    props.user?.role === UserRoles.HUT_WORKER ||
    props.user?.role === UserRoles.EMERGENCY_OPERATOR) {
    navigate('/')
  }

  return (


    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          className='signup-side'
          item
          sm={4}
          md={7}
          sx={{
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundColor: '#f9e9cb' }}>
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={e => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={e => setLastName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required={role !== 0}
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    autoComplete="family-name"
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RoleSelect setRole={setRole} role={role}></RoleSelect>
                </Grid>
                {
                  role===4 &&
                  <Grid item xs={12}>
                  <HutSelect setHutId={setHutId} hutId={hutId} listHuts={listHuts}/>
                  </Grid>
                }
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    onChange={ev => setEmail(ev.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={ev => setPassword(ev.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    onChange={ev => setConfirmPassword(ev.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid>
              {
                show ?
                  <Alert variant="outlined" sx={{mt: 3}} severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
              }
              </Grid>
              <Grid>
              {
                showInformation ?
                  <Alert sx={{mt: 3}}variant="outlined" severity="success" onClose={() => { setInformationMessage(''); setShowInformation(false) }}>{informationMessage}   {<Button sx={{ml: 5}}variant= 'outlined' outlined  onClick={() => { navigate("/login") }}>Login</Button>}</Alert> : <></>
              }
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item xs>
                  <Link href="/" variant="body2">
                    Go back
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export { SignUpForm }


function RoleSelect(props) {
  return <>

    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Role</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-seimple-select"
        value={props.role}
        fullWidth
        name="role"
        label="role"
        onChange={ev => props.setRole(ev.target.value)}
      >
        <MenuItem value={0}>
          Hiker
        </MenuItem>
        <MenuItem value={2}>
          Local Guide
        </MenuItem>
        {/*<MenuItem value={3}>
          Platform Manager
</MenuItem>*/}
        <MenuItem value={4}>
          Hut Worker
        </MenuItem>
        {/*<MenuItem value={5}>
          Emergency Operator
</MenuItem>*/}
      </Select>
    </FormControl>
  </>
}


function HutSelect(props) {

  

  return <>
    
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Hut</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-seimple-select"
        value={props.hutId}
        fullWidth
        name="hutId"
        label="Hut"

        onChange={ev => props.setHutId(ev.target.value)}
      >
        {
          props.listHuts.map((el)=>{

            console.log(el);
            console.log(el.id);
            return(
              <MenuItem value={el.id}>
                {el.title}
              </MenuItem>

            )
          })
        }
              </Select>
    </FormControl>
  </>

}