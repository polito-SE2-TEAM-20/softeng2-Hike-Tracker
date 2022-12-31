import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import API from '../../API/API.js';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PopupUnfinishedHike(props) {
    const [hikeIDsToDisplay, setHikeIDsToDisplay] = React.useState([props.hikeId]);
  const navigate = useNavigate();

const goToFinishHike = () => {
  //TODO navigate to the button to finish the hike
  props.setOpen(false);
  //navigate(`/showHike/${props.id}`)
};

  const handleClose = () => {
    props.setOpen(false);
    API.getUnfinishedHikesPopupSeen()
    .then((hikeIDsToDisplay) => {
      console.log(hikeIDsToDisplay)
      setHikeIDsToDisplay(hikeIDsToDisplay)
    })
    .catch((err) => { console.log(err) })    // get hikes/unfinished/popupsSeen/:hikeID
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
     <>
        <DialogTitle>{"Hike not completed"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        You have an unfinished hike {}

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToFinishHike}>Go to finish the hike</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
        </>
    </Dialog>
    </div>
    )
}

export {PopupUnfinishedHike}