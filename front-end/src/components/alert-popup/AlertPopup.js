import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, Typography } from '@mui/material';
import { DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';
import { Grid } from '@mui/material';
import API from '../../API/API';
import { HikeWeatherByCode } from '../../lib/common/WeatherConditions';
import { SvgIcon } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AlertPopup = (props) => {
    const [hikes, setHikes] = React.useState([])
    const [listOfAlerts, setListOfAlerts] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)

    const remindMeLater = () => {
        props.setAlertTimeout(60 * 1000)
        handleClose()
    };
    const confirm = () => {
        const apiDefinitiveClose = async () => {
            await API.definitiveClosePopup(hikes[0].id)
        }

        apiDefinitiveClose().then(() => {
            handleClose()
        })
    };
    const handleClose = () => {
        props.setOpen(false);
    };

    React.useEffect(() => {
        let loa = props.listOfAlerts.filter(alert => alert.weatherStatus >= 4 && alert.weatherStatus < 7)
        let tmpHikes = []

        const apiGetHikes = async () => {
            for (let index in props.listOfAlerts) {
                let x = await API.getSingleHikeByID(props.listOfAlerts[index].hikeId)
                tmpHikes.push(x)
            }
        }

        apiGetHikes().then(() => {
            setHikes(tmpHikes)
            for (let index in loa) {
                for (let index2 in tmpHikes) {
                    if (loa[index].hikeId === tmpHikes[index2].id) {
                        loa[index].hikeInfo = tmpHikes[index2]
                        break
                    }
                }
            }

            setListOfAlerts(loa)
            setLoaded(true)
        })
    }, [])

    if (!loaded) return <></>
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
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {
                            listOfAlerts.map(alert => {
                                return (
                                    <>
                                        <Typography>
                                            Hike name: <b>{alert.hikeInfo.title}</b>
                                        </Typography>
                                        <Typography>
                                            Current weather: <SvgIcon component={HikeWeatherByCode[alert.weatherStatus].image} />&nbsp;{HikeWeatherByCode[alert.weatherStatus].name}
                                        </Typography>
                                        <Typography>
                                            Description: <b>{alert.weatherDescription}</b>
                                        </Typography>
                                    </>
                                )
                            })
                        }
                        <br />
                        Please beware of storms or other unpredictable events.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                sx={{ borderRadius: "10px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}
                                onClick={remindMeLater}>Remind me later</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                sx={{ borderRadius: "10px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}
                                onClick={confirm}>I've understood</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>);
}