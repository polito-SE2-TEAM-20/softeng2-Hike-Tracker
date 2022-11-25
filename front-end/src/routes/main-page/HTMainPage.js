import { useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar'
import './main-page-style.css'
import { Box } from "@mui/material";
import { CardMedia } from "@mui/material";
import { displayType } from '../../extra/DisplayType';

const HTMainPage = (props) => {
    const navigate = useNavigate()

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Grid container spacing={0} style={{ backgroundColor: "#1a1a1a", height: "100%", minHeight: "100vh" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={props.navigate} />
            <div style={{ display: "grid", gridTemplateRows: "repeat(2, 0.5fr)", width: "100%" }}>
                <CardMedia sx={{ display: displayType.pc }} component="img"
                    height="800px"
                    style={{ gridRow: "1/2" }}
                    className="main-page"
                    alt="Paella dish">
                </CardMedia>
                <CardMedia sx={{ display: displayType.mobile }} component="img"
                    height="400px"
                    style={{ gridRow: "1/2" }}
                    className="main-page"
                    alt="Paella dish">
                </CardMedia>
                <Typography
                    variant="h2"
                    noWrap className="unselectable"
                    sx={{
                        display: displayType.pc,
                        fontFamily: "Crimson Text, serif",
                        fontWeight: 700, justifyContent: "center",
                        textAlign: "center",
                        color: '#ffffff',
                        textDecoration: 'none',
                        gridRow: "2/2"
                    }}
                >
                    where will your next adventure be?
                </Typography>
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        noWrap className="unselectable"
                        sx={{
                            display: displayType.mobile,
                            fontFamily: "Crimson Text, serif",
                            fontWeight: 700, justifyContent: "center",
                            textAlign: "center",
                            color: '#ffffff',
                            textDecoration: 'none',
                        }}
                    >
                        where will <br /> your next <br /> adventure be?
                    </Typography>
                </Grid>
            </div>
        </Grid >
    );
}

export default HTMainPage