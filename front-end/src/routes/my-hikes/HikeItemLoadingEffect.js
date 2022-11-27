import { Grid, Skeleton } from "@mui/material";

function HikeItemLoadingEffect(props) {
    return (
        <Grid item style={{  margin: 8}}>
            <Skeleton variant='rectangular' height={200} width={250} style={{ marginBottom: 8 }} />
            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: 4 }} />
            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: 4 }} />
        </Grid>
    )
}

export default HikeItemLoadingEffect;