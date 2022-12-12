import { Grid, Input, Typography } from "@mui/material"
import { Fab } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import './edit-hut-style.css'
import { APIURL } from "../../API/API";

export const AddPictureCard = (props) => {
    return (
        <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <label>
                <Input type="file" accept="image/*"
                    sx={{ display: "none" }} onChange={event => { event.preventDefault(); event.stopPropagation(); props.handleUpload(event) }} />
                <Fab
                    sx={{
                        backgroundColor: "#1a1a1aff", color: "white",
                        width: "80px", height: "80px",
                        borderRadius: "60px", "&:hover": {
                            backgroundColor: "#1a1a1ada"
                        }
                    }}
                    component="span"
                    aria-label="add"
                    variant="extended">
                    <AddIcon sx={{ fontSize: "64px" }} />
                </Fab>
            </label>
        </Grid>
    )
}

export const PictureCard = (props) => {
    if (props.isLocal) {
        return (
            <Grid container item sx={{ backgroundColor: "red", width: "200px", height: "250px", marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "35px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid sx={{display: props.isEditable ? "flex" : "none"}} item onClick={() => { props.handleDelete(props?.picture.id) }}>
                    <Typography
                        className="unselectable"
                        variant="h1"
                        fontSize={24}
                    >
                        <b>Remove</b>
                    </Typography>
                </Grid>
                <Grid item>
                    <img src={props?.picture.img} style={{ width: "200px", height: "250px", borderRadius: "8px", objectFit: "cover" }} alt="not found" />
                </Grid>
            </Grid>
        )
    }
    else {
        return (
            <Grid container item sx={{ backgroundColor: "red", width: "200px", height: "250px", marginLeft: "5px", marginRight: "5px", marginTop: "5px", marginBottom: "35px", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid sx={{display: props.isEditable ? "flex" : "none"}} item onClick={() => { props.handleDelete(props?.picture) }}>
                    <Typography
                        className="unselectable"
                        variant="h1"
                        fontSize={24}
                    >
                        <b>Remove</b>
                    </Typography>
                </Grid>
                <Grid item>
                    <img src={APIURL + props?.picture} style={{ width: "200px", height: "250px", borderRadius: "8px", objectFit: "cover" }} alt="not found" />
                </Grid>
            </Grid>
        )
    }
}