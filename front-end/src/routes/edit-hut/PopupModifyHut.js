import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PopupModifyHut(props) {
  const navigate = useNavigate();

const goToHutDetails = () => {
  //TODO navigate to the hike details
  props.setOpen(false);
  navigate(`/showhut/${props.id}`)
};

const modifyHut = () => {
  //TODO navigate to the hike details
  props.setOpen(false);
  navigate(`/edithut/${props.id}`)
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
      aria-describedby="alert-dialog-slide-description"
    >
      {
        props.id? ( <>
        <DialogTitle>{"Hut correctly modified"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        You have modified your hut, go to hut details to see it

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToHutDetails}>See hut details</Button>
        <Button onClick={goHome}>Go to the home page</Button>
      </DialogActions>
        </>

        ):(
 <>
        <DialogTitle>{"Something Went Wrong"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        {props.err}

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={modifyHut}>Modify again the hut</Button>
        <Button onClick={goHome}>Go to the home page</Button>
      </DialogActions>
        </>
        )
      }
    </Dialog>
  </div>  );
}

export {PopupModifyHut}