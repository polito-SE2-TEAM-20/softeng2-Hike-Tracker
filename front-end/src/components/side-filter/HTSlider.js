import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider(props) {
  const handleChange = (event, newValue) => {
    props.setFun(newValue)
  };

  return (
    <Box sx={{ width: 180}}>
      <Typography>{props.text}</Typography>
      <Slider
        getAriaLabel={() => 'Length range'}
        value={props.value}
        max={props.max}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </Box>
  );
}