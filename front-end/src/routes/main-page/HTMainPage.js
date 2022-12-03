import { useNavigate } from "react-router-dom";
import { Button, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar'
import './main-page-style.css'
import { CardMedia } from "@mui/material";
import mainPagePicture from '../../Assets/tmpmainpage.jpg'
import mainPagePicture2 from '../../Assets/mainpage2.jpg'
import mainPagePicture3 from '../../Assets/mainpage3.jpg'
import asidePicture from '../../Assets/aside.jpg'
import API from "../../API/API";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import HikeCard from "../../components/hike-card/HikeCard";

const HikeLoading = () => {
    return (
        <Grid lg={1} item sx={{ width: 120, my: 5 }}>
            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} sx={{ bgcolor: "#bababa" }} />
            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} sx={{ bgcolor: "#bababa" }} />
            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} sx={{ bgcolor: "#bababa" }} />
        </Grid>
    );
}

const HTMainPage = (props) => {
    const navigate = useNavigate()
    const [listOfHikes, setListOfHikes] = useState([])
    const [loading, setLoading] = useState(false)
    const [preferences, setPreferences] = useState({})

    useEffect(() => {
        var tmpPref = {}
        const getPreferences = async () => {
            tmpPref = await API.getPreferences()
        }
        getPreferences().then(() => {
            setPreferences(tmpPref)
            console.log(preferences)
        })
    }, [])

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getListOfHikes()
        }
        getHikes().then(() => {
            setListOfHikes(loh)
            setLoading(true)
        });
    }, [])

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <div style={{ backgroundColor: "#1a1a1a", height: "100%", minHeight: "100vh", paddingBottom: "5px" }}>
            <Grid columns={12} container spacing={0} style={{ height: "fit-content" }}>
                <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={props.navigate} />
                {
                    props.isLoggedIn && props?.user?.role === 0 ?
                        <>
                            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} columns={12} >
                                <Grid container item xs={4} sm={4} md={4} lg={4} xl={4} width="fit-content">
                                    <Grid item>
                                        <CardMedia component="img"
                                            style={{ objectFit: "cover", height: "100vh", marginTop: "25px" }}
                                            image={asidePicture}
                                            alt="Paella dish">
                                        </CardMedia>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={2} sm={2} md={2} lg={2} xl={2} columns={3} style={{ marginTop: "50px" }}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginBottom: "25px", display: "flex", justifyContent: "left", marginLeft: "50px" }}>
                                        <Typography
                                            variant="h2"
                                            className="unselectable"
                                            sx={{
                                                justifyContent: "left",
                                                textAlign: "left",
                                                color: '#ffffff',
                                                textDecoration: 'none',
                                                marginTop: "32px",
                                                "@keyframes headerMovement": {
                                                    '0%': {
                                                        textShadow: "0 0 1.00rem #EBC824"
                                                    },
                                                    '25%': {
                                                        textShadow: "0 0 0.75rem #C2A41D"
                                                    },
                                                    '50%': {
                                                        textShadow: "0 0 0.50rem #1a1a1a"
                                                    },
                                                    '75%': {
                                                        textShadow: "0 0 0.75rem #C2A41D"
                                                    },
                                                    '100%': {
                                                        textShadow: "0 0 1.00rem #EBC824"
                                                    }
                                                },
                                                animationIterationCount: "infinite",
                                                animationDuration: "3s",
                                                animationName: "headerMovement"
                                            }}
                                            fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "32px", xl: "32px" }}
                                        >
                                            Based on your preferences
                                        </Typography>
                                    </Grid>
                                    {
                                        loading ?
                                            listOfHikes.length === 0 ?
                                                <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                                    No hikes available for your preferences.
                                                </Typography>
                                                :
                                                listOfHikes.slice(0, 6).map((hike, index) => {
                                                    if (index < 3) {
                                                        return (
                                                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} style={{ marginBottom: "15px", display: "flex", justifyContent: "center", width: "fit-content" }}>
                                                                <HikeCard hike={hike} editable={false} />
                                                            </Grid>
                                                        );
                                                    }
                                                    else {
                                                        return (
                                                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} style={{ display: "flex", justifyContent: "center", width: "fit-content", opacity: "50%" }}>
                                                                <HikeCard hike={hike} editable={false} />
                                                            </Grid>
                                                        );
                                                    }
                                                })
                                            :
                                            <>
                                                <HikeLoading />
                                                <HikeLoading />
                                                <HikeLoading />
                                                <HikeLoading />
                                                <HikeLoading />
                                                <HikeLoading />
                                            </>
                                    }
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {
                                            listOfHikes.length > 6 ?
                                                <div style={{ marginTop: "28px", display: "flex", justifyContent: "center" }}>
                                                    <Button variant="outlined"
                                                        textDecoration="none"
                                                        onClick={() => { navigate('/listofhikes') }}
                                                        sx={{
                                                            borderRadius: "60px", borderColor: "white",
                                                            color: "white", textTransform: "none",
                                                            "&:hover": { borderColor: "#EBC824", color: "#EBC824" }
                                                        }}>
                                                        See more...
                                                    </Button>
                                                </div>
                                                : <></>
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>
                        </>
                        :
                        <>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <CardMedia component="img"
                                    height={{ xs: "400px", sm: "400px", md: "400px", lg: "500px", xl: "500px" }}
                                    style={{ objectFit: "cover", height: "100vh", width: "100vw" }}
                                    image={mainPagePicture}
                                    alt="Paella dish">
                                </CardMedia>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography
                                    variant="h2"
                                    className="unselectable"
                                    sx={{
                                        justifyContent: "center",
                                        fontFamily: "Crimson Text, serif",
                                        fontWeight: 700,
                                        textAlign: "center",
                                        color: '#EBC824',
                                        textDecoration: 'none',
                                        marginTop: { xs: "-350px", sm: "-350px", md: "-300px", lg: "-300px", xl: "-300px" },
                                        textShadow: "0 0 0.75rem black"
                                    }}
                                    fontSize={{ xs: "60px", sm: "70px", md: "75px", lg: "60px", xl: "60px" }}
                                >
                                    where will your next adventure be?
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                <Typography
                                    variant="h2"
                                    className="unselectable"
                                    sx={{
                                        justifyContent: "left",
                                        textAlign: "left",
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        marginTop: "32px",
                                        "@keyframes headerMovement": {
                                            '0%': {
                                                textShadow: "0 0 1.00rem #EBC824"
                                            },
                                            '25%': {
                                                textShadow: "0 0 0.75rem #C2A41D"
                                            },
                                            '50%': {
                                                textShadow: "0 0 0.50rem #1a1a1a"
                                            },
                                            '75%': {
                                                textShadow: "0 0 0.75rem #C2A41D"
                                            },
                                            '100%': {
                                                textShadow: "0 0 1.00rem #EBC824"
                                            }
                                        },
                                        animationIterationCount: "infinite",
                                        animationDuration: "3s",
                                        animationName: "headerMovement"
                                    }}
                                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "48px", xl: "48px" }}
                                >
                                    Connect with us
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />


                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                <Typography
                                    variant="h2"
                                    className="unselectable"
                                    sx={{
                                        justifyContent: "left",
                                        textAlign: "left",
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        marginTop: "32px"
                                    }}
                                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "24px", xl: "24px" }}
                                >
                                    Sign up on our website to get access to hikes suggestions based on your preferences and to browse our map to find your next experience.
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <CardMedia component="img"
                                    height={{ xs: "400px", sm: "400px", md: "400px", lg: "100px", xl: "100px" }}
                                    style={{ objectFit: "cover", height: "300px", width: "100vw", marginTop: "25px" }}
                                    image={mainPagePicture2}
                                    alt="Paella dish">
                                </CardMedia>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                <Typography
                                    variant="h2"
                                    className="unselectable"
                                    sx={{
                                        justifyContent: "right",
                                        textAlign: "right",
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        marginTop: "32px",
                                        "@keyframes headerMovement": {
                                            '0%': {
                                                textShadow: "0 0 1.00rem #EBC824"
                                            },
                                            '25%': {
                                                textShadow: "0 0 0.75rem #C2A41D"
                                            },
                                            '50%': {
                                                textShadow: "0 0 0.50rem #1a1a1a"
                                            },
                                            '75%': {
                                                textShadow: "0 0 0.75rem #C2A41D"
                                            },
                                            '100%': {
                                                textShadow: "0 0 1.00rem #EBC824"
                                            }
                                        },
                                        animationIterationCount: "infinite",
                                        animationDuration: "3s",
                                        animationName: "headerMovement"
                                    }}
                                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "48px", xl: "48px" }}
                                >
                                    Share your experiences
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />


                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                                <Typography
                                    variant="h2"
                                    className="unselectable"
                                    sx={{
                                        justifyContent: "right",
                                        textAlign: "right",
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        marginTop: "32px"
                                    }}
                                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "24px", xl: "24px" }}
                                >
                                    Once started, your adventure will be sharable with your friends with a single click: a link will give them a view on your track.
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <CardMedia component="img"
                                    height={{ xs: "400px", sm: "400px", md: "400px", lg: "100px", xl: "100px" }}
                                    style={{ objectFit: "cover", height: "300px", width: "100vw", marginTop: "25px" }}
                                    image={mainPagePicture3}
                                    alt="Paella dish">
                                </CardMedia>
                            </Grid>
                        </>
                }
            </Grid >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ backgroundColor: "#EBC824", height: "80px" }}>
                <Typography
                    variant="h2"
                    className="unselectable"
                    sx={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        display: "flex",
                        justifyContent: "left",
                        marginTop: "24px",
                        paddingTop: "15px",
                        marginLeft: "250px"
                    }}
                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "24px", xl: "24px" }}>
                    <b>HackTheHike.com</b>
                </Typography>
                <Typography
                    variant="h2"
                    className="unselectable"
                    sx={{
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "250px"
                    }}
                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "14px", xl: "14px" }}>
                    All rights reserved. 2022.
                </Typography>

            </Grid>
        </div>
    );
}

export default HTMainPage