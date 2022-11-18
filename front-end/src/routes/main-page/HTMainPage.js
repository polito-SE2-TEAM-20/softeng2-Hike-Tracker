import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar'
import './main-page-style.css'
import { Box } from "@mui/material";
import { CardMedia } from "@mui/material";

const HTMainPage = (props) => {
    const navigate = useNavigate()
    const responsiveContentStyleBig = { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }
    const responsiveContentStyleEnd = { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" }

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Grid container spacing={0} style={{ backgroundColor: "#ffffff", height: "100%", minHeight: "100vh" }}>
            <HTNavbar isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={props.navigate} />
            <div style={{display: "grid", gridTemplateRows:"repeat(5, 1fr)", width: "100%"}}>
                <CardMedia display={responsiveContentStyleBig} component="img"
                    height="540px"
                    style={{gridRow: "1/2"}}
                    className="main-page"
                    alt="Paella dish">
                </CardMedia>
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
                        gridRow: "2/2"
                    }}
                >
                    where will your next adventure be?
                </Typography>
            </div>
            <Grid item xs={12}>
                
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