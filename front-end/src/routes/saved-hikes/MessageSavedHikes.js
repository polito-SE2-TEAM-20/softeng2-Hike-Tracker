import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { useNavigate } from "react-router";
import React from "react";
import { Button } from "react-bootstrap";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MessageSavedHike(props) {

    const navigate = useNavigate()


    const closeMessageSavedHike = () => {
        navigate(`/showhike/${props.id}`);
        props.setMessage(null);
        props.setOpen(false);
        console.log(props.id);

    }
    const goToSavedHikes = () => {
        props.setMessage(null);
        props.setOpen(false);
        navigate('/savedHikes');
    }

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeMessageSavedHike}
            aria-describedby="alert-dialog-slide-description">
            {
                props.message !== null &&
                <>
                    <DialogTitle>{""}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {props.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeMessageSavedHike}>OK!</Button>
                        <Button onClick={goToSavedHikes}>Go to saved hikes</Button>

                    </DialogActions>
                </>
            }
        </Dialog>
    )
}

export { MessageSavedHike }