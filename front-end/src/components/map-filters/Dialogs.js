import { Button, Grid } from "@mui/material"
import * as React from 'react';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import HTDropdown from '../side-filter/HTDropdown'
import HTSlider from '../side-filter/HTSlider'
import HTButton from "../buttons/Button";

export function TextDialog(props) {
    const handleClose = () => {
        props.setOpen(false)
    };

    return (
        <Dialog onClose={handleClose} open={props.open}>
            <DialogTitle>Select a {props.text}</DialogTitle>
            <List sx={{ pt: 0, padding: "25px", height: "fit-content" }}>
                <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center", height: "400px" }}>
                    <HTDropdown dataset={props.dataset} hint={props.text} setFun={props.setFun} val={props.value} />
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <HTButton text="Confirm" navigate={handleClose} color="#55bb69" textColor="white" />
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                    <HTButton text="Clear" navigate={() => { props.setFun("") }} color="#ff5569" textColor="white" />
                </Grid>
            </List>
        </Dialog>
    );
}

export function SliderDialog(props) {

    const handleClose = () => {
        props.setOpen(false)
    };

    return (
        <Dialog onClose={handleClose} open={props.open} >
            <DialogTitle>{props.text}</DialogTitle>
            <List sx={{ pt: 0, padding: "25px" }}>
                <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={props.value} setFun={props.setFun} max={props.max} />
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <HTButton text="Confirm" navigate={handleClose} color="#55bb69" textColor="white" />
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                    <HTButton text="Clear" navigate={() => { props.setFun([0, props.max]) }} color="#ff5569" textColor="white" />
                </Grid>
            </List>
        </Dialog>
    );
}

export function UploadPictureDialog(props) {
    const handleClose = () => {
        props.setOpen(false)
    };

    return (
        <Dialog onClose={handleClose} open={props.open} >
            <DialogTitle>Upload a new picture</DialogTitle>
            <List sx={{ pt: 0, padding: "25px" }}>
                <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="outlined" sx={{
                        borderRadius: "60px",
                        height: "60px",
                        width: "60px", color: "#1a1a1a",
                        borderColor: "#1a1a1a",
                        "&:hover": { backgroundColor: "#1a1a1a", color: "white", borderColor: "black" },
                        textTransform: "none"
                    }}>+</Button>
                </Grid>
            </List>
        </Dialog>
    );
}