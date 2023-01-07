import { Button, Grid, Typography } from "@mui/material"
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from "react-router";

const Unauthorized = () => {
    const navigate = useNavigate()
    return (
    <Grid container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
            <Grid container item >
                <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
                    <BlockIcon sx={{ fontSize: "72px" }} />
                </Grid>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
                    <Typography className="unselectable">
                        Sorry, you are not authorized.
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
                    <Button variant="outlined" sx={{textTransform: "none", borderRadius: "120px", marginTop: "32px"}} onClick={() => {navigate("/")}}>Back to homepage</Button>
                </Grid>
            </Grid>
    </Grid>
    )
}

export default Unauthorized