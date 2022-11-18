import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Grid, MenuItem } from '@mui/material';
import HTButton from '../buttons/Button';
import { Paper } from '@mui/material';

function HTSidefilter(props) {
  return (
    <Paper elevation={5} sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          <TextField
            id="outlined-select-currency"
            select
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            label="Region"
            value={props.region}
            onChange={(event) => { props.setRegion(event.target.value) }}
          >
            {["ciao", "ciaone"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-select-currency"
            select
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            label="Province"
            value={props.province}
            onChange={(event) => { props.setProvince(event.target.value) }}
          >
            {["ciao", "ciaone"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-select-currency"
            select
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            label="Minimum difficulty"
            value={props.minDiff}
            onChange={(event) => { props.setMinDiff(event.target.value) }}
          >
            {["Tourist", "Hiker", "Pro"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-select-currency"
            select
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            label="Maximum difficulty"
            value={props.maxDiff}
            onChange={(event) => { props.setMaxDiff(event.target.value) }}
          >
            {["Tourist", "Hiker", "Pro"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Minimum length"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">km</InputAdornment>,
            }}
          />

          <TextField
            label="Maximum length"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">km</InputAdornment>,
            }}
          />

          <TextField
            label="Minimum ascent"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">m</InputAdornment>,
            }}
          />

          <TextField
            label="Maximum ascent"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">m</InputAdornment>,
            }}
          />

          <TextField
            label="Min expected time"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">hours</InputAdornment>,
            }}
          />

          <TextField
            label="Max expected time"
            id="outlined-start-adornment"
            variant="filled"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              endAdornment: <InputAdornment position="start">hours</InputAdornment>,
            }}
          />
        </div>


      </Box>

      <Grid container>
        <Grid item lg={6} sx={{ display: "flex", justifyContent: "center", marginTop: "12px", marginBottom: "24px" }}>
          <HTButton text="Apply" color="black" textColor="white" size="18px" />
        </Grid>
        <Grid item lg={6} sx={{ display: "flex", justifyContent: "center", marginTop: "12px", marginBottom: "24px" }}>
          <HTButton text="Reset" color="black" textColor="white" size="18px" />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default HTSidefilter
