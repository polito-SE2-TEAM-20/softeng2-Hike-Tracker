import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PopupEditHike(props) {
    const navigate = useNavigate();

    const goToHikeDetails = () => {
        //TODO navigate to the hike details
        props.setOpen(false);
        navigate(`/showHike/${props.id}`)
    };

    const goHome = () => {
        props.setOpen(false);
        navigate('/')
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
                aria-describedby="alert-dialog-slide-description">
                {
                    (props.err === null || props.err === undefined) && 
                    <>
                        <DialogTitle>{"Hike correctly edited"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                You have edited your hike, go to hike details to see it

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={goToHikeDetails}>See hike details</Button>
                            <Button onClick={goHome}>Go to the home page</Button>
                        </DialogActions>
                    </>
                }
                {   
                    (props.err !== null && props.err !== undefined ) && 
                    <>
                        <DialogTitle>{"Something Went Wrong while ediing your hike."}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {props.err}

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={goHome}>Go to the home page</Button>
                        </DialogActions>
                    </>
                }
            </Dialog>
        </div>);
}

export { PopupEditHike }