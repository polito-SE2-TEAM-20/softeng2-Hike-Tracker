import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function ParkingDescription(props) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Parking information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="price"
                        label="price"
                        helperText="Price per hour"
                        fullWidth
                        type="number"
                        autoComplete="price"
                        variant="standard"

                        value={props.price}
                        onChange={(e) => { props.setPrice(e.target.value) }}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="spots"
                        label="spots"
                        helperText="Number of Spots"
                        fullWidth
                        type="number"
                        autoComplete="spots"
                        variant="standard"

                        value={props.spots}
                        onChange={(e) => { props.setSpots(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} >
                    <TextField
                        required
                        id="description"
                        name="description"
                        label="Description (max 1000 characters)"
                        fullWidth
                        autoComplete="description"
                        variant="standard"
                        multiline
                        inputProps={
                            { maxLength: 999 }
                        }
                        //mettere un alert se vai oltre
                        value={props.description}
                        onChange={(e) => { props.setDescription(e.target.value) }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export { ParkingDescription }