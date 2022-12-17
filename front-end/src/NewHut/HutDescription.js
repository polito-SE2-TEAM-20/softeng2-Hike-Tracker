import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function HutDescription(props) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Hut information
            </Typography>
            {/* in owner name there is the email address*/ }
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="owner"
                        label="owner name"
                        fullWidth
                        autoComplete="owner"
                        variant="standard"
                        value={props.owner}
                        onChange={(e) => { props.setOwner(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="website"
                        label="Website"
                        fullWidth
                        autoComplete="website"
                        variant="standard"
                        value={props.website}
                        onChange={(e) => { props.setWebsite(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="price"
                        label="price"
                        helperText="Price per night"
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
                        id="beds"
                        label="beds"
                        helperText="Number of Beds"
                        fullWidth
                        type="number"
                        autoComplete="beds"
                        variant="standard"

                        value={props.beds}
                        onChange={(e) => { props.setBeds(e.target.value) }}
                    />
                </Grid>
                
                <Grid item xs={12} >
                    <TextField
                    required
                        id="emailAddress"
                        label="Email address"
                        fullWidth
                        autoComplete="emailAddress"
                        variant="standard"

                        value={props.emailAddress}
                        onChange={(e) => { props.setEmailAddress(e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} >
                    <TextField
                    required
                        id="phoneNumber"
                        label="Phone Number"
                        fullWidth
                        autoComplete="phoneNumber"
                        variant="standard"

                        value={props.phoneNumber}
                        onChange={(e) => { props.setPhoneNumber(e.target.value) }}
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
                            { maxLength: 990 }
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

export { HutDescription }