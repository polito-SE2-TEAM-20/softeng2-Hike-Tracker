import { useNavigate } from "react-router-dom";
import { Button, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar'
import './main-page-style.css'
import { CardMedia } from "@mui/material";
import mainPagePicture from '../../Assets/mainpage.jpg'
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
        <div style={{ backgroundColor: "#1a1a1a", height: "100%", minHeight: "100vh", paddingBottom: "60px" }}>
            <Grid columns={12} container spacing={0} style={{ height: "fit-content" }}>
                <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={props.navigate} />
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <CardMedia component="img"
                        height={{ xs: "400px", sm: "400px", md: "400px", lg: "500px", xl: "500px" }}
                        style={{ objectFit: "cover", height: "500px", width: "100vw" }}
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
                            color: '#ffffff',
                            textDecoration: 'none',
                        }}
                        fontSize={{ xs: "25px", sm: "25px", md: "45px", lg: "60px", xl: "60px" }}
                    >
                        where will your next adventure be?
                    </Typography>
                </Grid>

                {
                    props.isLoggedIn && props?.user?.role === 0 ?
                        <>
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
                                    fontSize={{ xs: "18px", sm: "18px", md: "24px", lg: "32px", xl: "32px" }}
                                >
                                    Based on your preferences:
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />

                            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} columns={3} style={{ display: "flex", justifyContent: "center", marginLeft: "300px", marginRight: "300px" }}>
                                {
                                    loading ?
                                        listOfHikes.length === 0 ?
                                            <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                                No matching hikes.
                                            </Typography>
                                            :
                                            listOfHikes.slice(0, 6).map(hike => {
                                                return (
                                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} style={{ marginTop: "25px", marginBottom: "5px", display: "flex", justifyContent: "center", width: "fit-content" }}>
                                                        <HikeCard hike={hike} editable={false} />
                                                    </Grid>
                                                );
                                            })
                                        :
                                        <>
                                            <HikeLoading />
                                            <HikeLoading />
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
                                                    sx={{ borderRadius: "60px", borderColor: "white", color: "white", textTransform: "none" }}>
                                                    See more...
                                                </Button>
                                            </div>
                                            : <></>
                                    }
                                </Grid>
                            </Grid>
                        </>:<></>
                }
            </Grid >
        </div>
    );
}

export default HTMainPage