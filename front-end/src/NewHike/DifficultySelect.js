import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


function DifficultySelect(props) {
    return <>
  
      <FormControl fullWidth required>
        <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.difficultyStr}
          fullWidth
          name="difficultyStr"
          variant="standard"
          label="difficultyStr"
          onChange={ev => props.setDifficultyStr(ev.target.value)}
        >
          <MenuItem value={0}>
            Tourist
          </MenuItem>
          <MenuItem value={1}>
            Hiker
          </MenuItem>
          <MenuItem value={2}>
            Professional Hiker
          </MenuItem>
        </Select>
      </FormControl>
    </>
  }

  export {DifficultySelect}