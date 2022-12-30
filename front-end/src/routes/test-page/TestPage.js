import ShareHike from "../../components/share-hike/ShareHike"
import { Grid } from "@mui/material"
import VerifyKey from "../../components/share-hike/VerifyKey"

const TestPage = () => {
    return(
        // <VerifyKey />

        <Grid container sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <ShareHike />
        </Grid>
    )
}

export default TestPage