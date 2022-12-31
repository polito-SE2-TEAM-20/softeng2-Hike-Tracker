import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AlertPopup = (props) => {
    const navigate = useNavigate();

    const remindMeLater = () => {
        handleClose()
        // navigate(`/admindashboard`)
    };
    const confirm = () => {
        handleClose()
        // navigate('/new-weather-alert-hike')
    };
    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Weather alert"}</DialogTitle>
                <DialogActions>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display: "flex", justifyContent: "center"}}>
                            <Button
                                sx={{ borderRadius: "10px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}
                                onClick={remindMeLater}>Remind me later</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display: "flex", justifyContent: "center"}}>
                            <Button
                                sx={{ borderRadius: "10px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}
                                onClick={confirm}>I've understood</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>);
}