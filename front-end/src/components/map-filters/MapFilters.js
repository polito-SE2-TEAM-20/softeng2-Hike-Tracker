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
import { displayTypeFlex } from '../../extra/DisplayType';

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
        <>
            {/**
            * PC
            */}
            <Paper elevation={5} columns={12} sx={{ display: displayTypeFlex.pc }} style={{ width: "fit-content", height: "fit-content", borderRadius: "25px", backgroundColor: "#ffffff", marginTop: "85px", marginLeft: "15px", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth container spacing={1} direction="row">
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Region" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Province" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Length" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Expected time" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Ascent" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Difficulty" clickable />
                    </Grid>
                    <Grid item md={6} lg={6} xl={6}>
                        <Chip onClick={handleClickOpen} label="Radius" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2} sx={{ display: "flex", justifyContent: "center", marginRight: "24px" }}>
                        <HTButton text="Apply" color="black" textColor="white" size="14px" />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2} sx={{ display: "flex", justifyContent: "center" }}>
                        <HTButton text="Reset" color="black" textColor="white" size="14px" />
                    </Grid>
                </Grid >
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />

            </Paper>

            {/**
            * TABLET
            */}
            <Paper elevation={5} columns={12} sx={{ display: displayTypeFlex.tablet }} style={{ width: "fit-content", height: "fit-content", borderRadius: "25px", backgroundColor: "#ffffff", marginTop: "85px", marginLeft: "15px", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth container spacing={1} direction="row">
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Region" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Province" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Length" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Expected time" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Ascent" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2}>
                        <Chip onClick={handleClickOpen} label="Difficulty" clickable />
                    </Grid>
                    <Grid item md={6} lg={6} xl={6}>
                        <Chip onClick={handleClickOpen} label="Radius" clickable />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2} sx={{ display: "flex", justifyContent: "center", marginRight: "24px" }}>
                        <HTButton text="Apply" color="black" textColor="white" size="14px" />
                    </Grid>
                    <Grid item md={2} lg={2} xl={2} sx={{ display: "flex", justifyContent: "center" }}>
                        <HTButton text="Reset" color="black" textColor="white" size="14px" />
                    </Grid>
                </Grid >
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />

            </Paper>

            {/**
            * MOBILE
            */}
            <Paper elevation={5} sx={{ display: displayTypeFlex.mobile }} style={{ width: "fit-content", height: "200px", backgroundColor: "#ffffff", marginTop: "70px", marginLeft: "auto", marginRight: "auto", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth container spacing={1} direction="row">
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Region" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Province" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Length" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Expected time" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Ascent" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip onClick={handleClickOpen} label="Difficulty" clickable />
                    </Grid>
                    <Grid item xs={4}>
                        <Chip onClick={handleClickOpen} label="Radius" clickable />
                    </Grid>
                    <Grid item container columns={12} zeroMinWidth style={{ display: "flex", justifyContent: "center" }}>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <HTButton text="Apply" color="black" textColor="white" size="14px" />
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <HTButton text="Reset" color="black" textColor="white" size="14px" />
                        </Grid>
                    </Grid>
                </Grid >
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />

            </Paper>
        </>

    )
}

export default MapFilters
