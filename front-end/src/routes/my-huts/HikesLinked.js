
import { Grid, Typography, CircularProgress, Skeleton} from "@mui/material";
import { displayTypeFlex } from "../../extra/DisplayType";
import '../admin-dashboard/admin-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HTButton from "../../components/buttons/Button";
import API from '../../API/API.js';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";




import { useEffect, useState } from 'react';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import { useNavigate } from 'react-router-dom';




const HikesLinked = (props) => {

    const [loaded, setLoaded] = useState(false);
    const [hikesUpdatable, setHikesUpdatable] = useState([]);
    const [cause, setCause] = useState("");
    const [hikeCondition, setHikeCondition] = useState(-1);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()

    useEffect(() => {  
        setLoaded(false);

        API.getHikesUpdatableHutWorker()
           .then((hikes)=>{
            setHikesUpdatable(oldHikes => hikes)
            setLoaded(true);
            console.log(hikes);
           })
      
    }, [])

    const modifyHike = (hikeId) =>{
        let object = {condition: hikeCondition, cause: cause};
        API.updateHikeCondition(object, hikeId)
           .then((updatedHike) =>{
              setShow(false);
              setErrorMessage('');
           })
           .catch((err) =>{
            setErrorMessage(err);
            setShow(true);
           })
    }

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <>
        <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />

        <Grid container columns={12} display="flex" justifyContent="center" style={{ marginTop: "105px" }}>
            {console.log(hikesUpdatable)}
            <Grid container item lg={8} xl={6} justifyContent="center" height="fit-content" sx={{ marginLeft: "25px", marginBottom: "35px" }}>
                <Grid item lg={6} xl={6}>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Hikes Linked</b>
                        </Typography>
                    </Grid>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={14} color="#555555">
                            Here are the hikes linked to your hut
                        </Typography>
                    </Grid>
                </Grid>

                <Grid lg={12} xl={12} sx={{ marginTop: "28px" }}>
                    {
                        !loaded ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                        Loading...
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <CircularProgress lg={12} xl={12} size="72px" />
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        loaded && hikesUpdatable.length === 0 ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" className="unselectable">
                                        {hikesUpdatable.length === 0  &&  "There are no hikes linked to your hut"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        loaded && hikesUpdatable.length !== 0 ?
                            hikesUpdatable.map(hike => {
                                    return (
                                        <Accordion sx={{ml:"20px", mr:"80px"}}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {hike.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Description</b>: {hike.description}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Length</b>: {hike.length}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Ascent</b>: {hike.ascent}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Expected time</b>: {hike.expectedTime}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Hike condition</b>: <ConditionSelect hikeCondition={hikeCondition} setHikeCondition={setHikeCondition}/></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <><Typography><b>Cause:</b></Typography>
                                                    <TextField required fullWidth variant="standard" 
                                                    value={cause}
                                                     onChange={(e) => { setCause(e.target.value) }}
                                                    ></TextField></>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}sx={{ display: "flex", justifyContent: "right", mt:10 }}>
                                                        <HTButton onClick={() => { modifyHike(hike.id) }} text="Modify hike condition" textSize="18px" textColor="white" color="#33aa33" />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                            }
                            )
                            : <></>
                    }
                </Grid>
            </Grid>
        </Grid>
        </>
    )
}

export {HikesLinked}


function ConditionSelect(props) {
    return <>
  
      <FormControl fullWidth required>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.hikeCondition}
          fullWidth
          variant="standard"
          onChange={ev => props.setHikeCondition(ev.target.value)}
        >
          <MenuItem value={0}>
            Open
          </MenuItem>
          <MenuItem value={1}>
            Closed
          </MenuItem>
          <MenuItem value={2}>
            Partially Blocked
          </MenuItem>
          <MenuItem value={3}>
            Special gear required
          </MenuItem>
        </Select>
      </FormControl>
    </>
  }

  export {ConditionSelect}
