import { Chip, Grid, Paper } from "@mui/material"
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { useState } from "react";
import HTButton from "../buttons/Button";
import { TextField } from "@mui/material";

const emails = ['username@gmail.com', 'user02@gmail.com'];

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <List sx={{ pt: 0 }}>
                {emails.map((email) => (
                    <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={email} />
                    </ListItem>
                ))}

                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemAvatar>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add account" />
                </ListItem>
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

const MapFilters = (props) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    return (
        <Paper elevation={5} style={{ width: "fit-content", height: "140px", borderRadius: "25px", backgroundColor: "#ffffff", marginTop: "85px", marginLeft: "15px", padding: "25px", zIndex: "15", position: "fixed" }}>
            <Grid zeroMinWidth container spacing={2} direction="row">
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Region" clickable />
                </Grid>
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Province" clickable />
                </Grid>
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Length" clickable />
                </Grid>
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Expected time" clickable />
                </Grid>
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Ascent" clickable />
                </Grid>
                <Grid item>
                    <Chip onClick={handleClickOpen} label="Difficulty" clickable />
                </Grid>
            </Grid >
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
            <Grid container columns={12} zeroMinWidth style={{ marginTop: "20px", display: "flex", justifyContent: "left" }}>
                <Grid item>
                    <TextField sx={{ display: "flex", justifyContent: "left", marginRight: "18px", width: "15vw" }} label="Search" size="small" />
                </Grid>
                <Grid item lg={1} sx={{ display: "flex", justifyContent: "center", marginRight: "24px" }}>
                    <HTButton text="Apply" color="black" textColor="white" size="14px" />
                </Grid>
                <Grid item lg={1} sx={{ display: "flex", justifyContent: "center" }}>
                    <HTButton text="Reset" color="black" textColor="white" size="14px" />
                </Grid>
            </Grid>
        </Paper>

    )
}

export default MapFilters
