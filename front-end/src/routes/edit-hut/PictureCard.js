import { Grid, Input, Typography, CardMedia, Button } from "@mui/material"
import { Fab } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import './edit-hut-style.css'
import { useRef, useEffect, useState } from "react";

export const AddPictureCard = (props) => {
    return (
        <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography
                variant="h1"
                className="unselectable"
            >
                <label>
                    <Input type="file" accept="image/*"
                        sx={{ display: "none" }} onChange={event => {event.preventDefault(); event.stopPropagation(); props.handleUpload(event)}} />
                    <Fab
                        sx={{
                            backgroundColor: "#1a1a1aff", color: "white", width: "80px", height: "80px", borderRadius: "60px", "&:hover": {
                                backgroundColor: "#1a1a1ada"
                            }
                        }}
                        component="span"
                        aria-label="add"
                        variant="extended"
                    >
                        <AddIcon sx={{ fontSize: "64px" }} />
                    </Fab>
                </label>
            </Typography>
        </Grid>
    )
}

export const PictureCard = (props) => {
    return (
        <Grid item sx={{ backgroundColor: "grey", width: "200px", height: "250px", margin: "5px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={props?.img} style={{ width: "200px", height: "250px", borderRadius: "8px", objectFit: "cover" }} alt="not found" />
        </Grid>
    )
}