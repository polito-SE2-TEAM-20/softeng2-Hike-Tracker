import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar'

const HTMainPage = (props) => {
    const navigate = useNavigate()
    const responsiveContentStyleBig = { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }
    const responsiveContentStyleEnd = { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" }

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }
    
    return (
        <Grid container spacing={0} style={{ backgroundColor: "#A6A6A6", height: "100%", minHeight: "100vh" }}>
            <HTNavbar isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={props.navigate} />
            <Grid display={responsiveContentStyleBig}
                justifyContent="center"
                item xs={12} sm={12} md={12} lg={12} xl={12}>
                <img
                    src={"https://cdn.pixabay.com/photo/2019/06/08/17/40/landscape-4260630_960_720.jpg"}
                    alt="main-page-image"
                    style={{ borderRadius: "62px", marginTop: "120px" }}
                    loading="lazy"
                />
            </Grid>
            <Grid display={responsiveContentStyleEnd} justifyContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
                <img
                    src={"https://cdn.pixabay.com/photo/2019/06/08/17/40/landscape-4260630_960_720.jpg"}
                    alt="main-page-image"
                    style={{ borderRadius: "62px", heigth: "auto", width: { xs: "415px", lg: "500px" }, marginTop: "120px" }}
                    loading="lazy"
                />
            </Grid>
            <Grid item xs={12}>
                <Typography
                    variant="h2"
                    noWrap className="unselectable"
                    sx={{
                        display: responsiveContentStyleBig,
                        fontFamily: "Crimson Text, serif",
                        fontWeight: 700, justifyContent: "center",
                        textAlign: "center",
                        color: '#1a1a1a',
                        textDecoration: 'none',
                    }}
                >
                    where will your next adventure be?
                </Typography>
                <Typography
                    variant="h4"
                    noWrap className="unselectable"
                    sx={{
                        display: responsiveContentStyleEnd,
                        fontFamily: "Crimson Text, serif",
                        fontWeight: 700, justifyContent: "center",
                        textAlign: "center",
                        color: '#1a1a1a',
                        textDecoration: 'none',
                    }}
                >
                    where will <br /> your next <br /> adventure be?
                </Typography>
            </Grid>
        </Grid >
    );
}

export default HTMainPage