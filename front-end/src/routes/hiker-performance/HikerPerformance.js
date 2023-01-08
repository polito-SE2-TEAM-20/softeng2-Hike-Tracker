import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import API from '../../API/API.js';
import { useEffect, useState } from 'react';
import { Grid, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserRoles } from '../../lib/common/UserRoles.js';

const HikerPerformance = (props) => {
    const [myPerformance, setMyPerformance] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.getPerformanceStats().then((stats) => {
            setMyPerformance(stats)
            setLoading(false)
            console.log(stats)
            console.log(myPerformance)
            console.log(myPerformance[0]);
        });
    }, [])

    const navigate = useNavigate()

    if (props.user?.role !== UserRoles.HIKER) {
        navigate('/unauthorized')
    }
    return (
        <>
            <Grid container item height="fit-content" justifyContent="center" sx={{ marginTop: "25px" }}>
                <Grid style={{ justifyContent: "center" }}>
                    <Typography fontSize={32} sx={{ fontFamily: "Unbounded", textAlign: "center" }}>
                        <b>Some stats based on your finished hikes</b>
                    </Typography>
                </Grid>
                <Grid lg={12} xl={12}>
                    <Typography fontSize={14} color="#555555">

                    </Typography>
                </Grid>
            </Grid>
            <Grid container style={{ justifyContent: "center" }}>
                <Grid item xl={9} style={{ justifyContent: "center" }}>
                    <Grid container columns={9} style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>
                        {
                            !loading ?
                                (
                                    <>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Average Pace
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance?.stats[0].value === null ? '0' : myPerformance?.stats[0]?.value} {[myPerformance?.stats[0]?.unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Average vertical ascent speed
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[1].value === null ? '0' : myPerformance.stats[1].value} {[myPerformance.stats[1].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Fasted pace
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[2].value === null ? '0' : myPerformance.stats[2].value} {[myPerformance.stats[2].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>

                                                            Highest altitude reached
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[3].value === null ? '0' : myPerformance.stats[3].value} {[myPerformance.stats[3].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Largest altitude range
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[4].value === null ? '0' : myPerformance.stats[4].value} {[myPerformance.stats[4].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Longest hike distance

                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[5].value === null ? '0' : myPerformance.stats[5].value} {[myPerformance.stats[5].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Longest hike in terms of time
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[6].value === null ? '0' : myPerformance.stats[6].value} {[myPerformance.stats[6].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Shortest hike in terms of kms
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[7].value === null ? '0' : myPerformance.stats[7].value} {[myPerformance.stats[7].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Shortest hike in terms of time
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[8].value === null ? '0' : myPerformance.stats[8].value} {[myPerformance.stats[8].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Total hikes finished
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[9].value === null ? '0' : myPerformance.stats[9].value} {[myPerformance.stats[9].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>                </Grid>
                                        <Grid item md={3} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <div className="zoom">
                                                <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: 140 }}>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                                                            Totale kms walked
                                                        </Typography>
                                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                            {myPerformance.stats[10].value === null ? '0' : myPerformance.stats[10].value} {[myPerformance.stats[10].unit]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Grid>
                                    </>)
                                :
                                (
                                    <>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                        </Grid>
                                    </>
                                )
                        }

                    </Grid>
                </Grid>
            </Grid>
        </>
    );




}

export default HikerPerformance
