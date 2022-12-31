import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Input } from "@mui/material"
import { Fab } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

function HutDescription(props) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Hut information
            </Typography>
            {/* in owner name there is the email address*/}
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
                <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} columns={4} sx={{ display: "flex", justifyContent: "left", marginTop: "24px", padding: "0px 64px 64px 64px" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} columns={4} sx={{ display: "flex", justifyContent: "center", marginTop: "18px", marginBottom: "24px" }}>
                        <Typography variant="h1" fontSize={52} className="unselectable">
                            A  picture of the hut
                        </Typography>
                    </Grid>
                    {
                        props.pictures.length === 0 ? (
                            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} sx={{ display: "flex", justifyContent: "center" }}>
                                <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <label>
                                        <Input type="file" accept="image/*"
                                            sx={{ display: "none" }} onChange={event => { event.preventDefault(); event.stopPropagation(); props.handleUpload(event) }} />
                                        <Fab
                                            sx={{
                                                backgroundColor: "#1a1a1aff", color: "white",
                                                width: "80px", height: "80px",
                                                borderRadius: "60px", "&:hover": {
                                                    backgroundColor: "#1a1a1ada"
                                                }
                                            }}
                                            component="span"
                                            aria-label="add"
                                            variant="extended">
                                            <AddIcon sx={{ fontSize: "64px" }} />
                                        </Fab>
                                    </label>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
                                <Grid container item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>

                                    <Grid container item sx={{ backgroundColor: "red", width: "200px", height: "250px", marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "35px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Grid sx={{ display: "flex" }} item onClick={() => { props.handleDeleteLocal(props.pictures) }}>
                                            <Typography
                                                className="unselectable"
                                                variant="h1"
                                                fontSize={24}
                                            >
                                                <b>Remove</b>
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <img src={props.picData.img} style={{ width: "200px", height: "250px", borderRadius: "8px", objectFit: "cover" }} alt="not found" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    }
                </Grid>

            </Grid>
        </React.Fragment>
    );
}

export { HutDescription }