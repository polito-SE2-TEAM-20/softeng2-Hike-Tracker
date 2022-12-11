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

function PopupEditCondition(props) {
  const navigate = useNavigate();

  const retry = () => {
    props.setOpen(false);
    navigate(`/modifyHikeCondition/${props.id}`)
  };

  const goBack = () => {
    props.setOpen(false);
    navigate('/hutWorkerHuts/linkedHikes');
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
          (props.err === null || props.err === undefined) &&
          <>
            <DialogTitle>{"Hike condition correctly modified"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                You have modified the condition of the hike, go back to see it

              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={goBack}>Go back</Button>
              <Button onClick={goHome}>Go to the home page</Button>
            </DialogActions>
          </>
        }{(props.err !== null && props.err !== undefined) &&
          <>
            <DialogTitle>{"Something Went Wrong"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {props.err}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={goBack}>Go back</Button>
              <Button onClick={retry}>Change the condition again</Button>
            </DialogActions>
          </>
        }
      </Dialog>
    </div>);
}

export { PopupEditCondition }