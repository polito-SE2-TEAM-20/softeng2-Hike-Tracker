import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router";
import { createSearchParams } from "react-router-dom";
import { APIURL } from "../../API/API";
const dayjs = require('dayjs')
var localizedFormat = require('dayjs/plugin/localizedFormat')
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
dayjs.extend(localizedFormat)

function HikeItem(props) {
    const navigate = useNavigate()

    const startDate = dayjs(props.trackHike.startedAt)
    
    const duration = props.trackHike.finishedAt ? (dayjs.duration(dayjs(props.trackHike.finishedAt).diff(startDate)).format('D:HH:mm:ss')) : "not finished yet"

    const imageUrl = (props.trackHike.hike.pictures && props.trackHike.hike.pictures.length > 0) ? (APIURL + props.trackHike.hike.pictures[0]) : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"

    const handleOpeningTrackingHikePage = () => {
        navigate("/trackhike/" + props.trackHike.hike.id, {
            state: {
                trackHikeId: props.trackHike.id
            }
        })
    }

    return (
        <Card
            variant="outlined"
            color= "success"
            style={{
                marginTop: 12, marginBotom: 12, marginRight: 8, marginLeft: 8,
                width: "90vh",
                maxWidth: 400
            }}>
            <CardActionArea
                onClick={handleOpeningTrackingHikePage}
                >
                <CardMedia
                    component="img"
                    wide
                    style={{ minHeight: 140}}
                    src={imageUrl}/>

                <CardContent>
                    <Grid
                        container
                        direction="column">
                        <Typography gutterBottom variant="h5" component="div">
                            {props.trackHike.hike.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary"
                            style={{
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}>
                            {props.trackHike.hike.description}
                        </Typography>
                        <Typography variant="body">
                            Started At: {startDate.format("LLL")}
                        </Typography>
                        <Typography variant="body">
                            Duration: {duration}
                        </Typography>
                    </Grid>         
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default HikeItem;