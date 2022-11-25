import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox(props) {
  return (
    <Autocomplete
      value={props.val}
      disablePortal
      onChange={(e,v,x) => props.setFun(v)}
      disableClearable
      id="combo-box-demo"
      options={props.dataset}
      sx={{ width: 200, color: "white", zIndex: "50" }}
      renderInput={(params) => <TextField {...params} label={props.hint} />}
    />
  );
}