import { Card, CardContent, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import API from "../../API/API"
import { UserHikeState } from "../../lib/common/Hike"

function HikerHikesPage(props) {

    const [isLoading, setLoading] = useState(false)
    const [finishedHikes, setFinishedHikes] = useState([])
    const [unfinishedHikes, setUnFinishedHikes] = useState([])


    useEffect(() => {

        const getHikes = async() => {
            const allHikes = API.getAllUserTrackingHikes(UserHikeState.ALL);
            setFinishedHikes(allHikes.filter((item => item.finishedAt !== null)))
            setUnFinishedHikes(allHikes.filter((item => item.finishedAt === null)))
        }

        getHikes()
    }, [])



    return (
        <Grid container>

            {
                (unfinishedHikes !== null && unfinishedHikes.length > 0) &&
                <>
                    <Grid
                        item>
                        <Typography variant="h6" gutterBottom>
                            Unfinished Hikes
                        </Typography>
                    </Grid>
                    <Grid container>
                        {
                            unfinishedHikes.map((hike) => {
                                return (
                                    <Grid item >
                                        <HikeItem hike={hike}/>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </>
            }

            {
                (finishedHikes !== null && finishedHikes.length > 0) &&
                <>
                    <Grid
                        item
                        style={{ marginTop: 32 }}>
                        <Typography variant="h6" gutterBottom>
                            Finished Hikes
                        </Typography>
                    </Grid>
                    <Grid
                        container>
                        {
                            finishedHikes.map((hike) => {
                                return (
                                    <Grid item >
                                        <HikeItem hike={hike}/>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </>
            }

        </Grid>
    )
}

function HikeItem(props) {
    return (
        <Card
            style={{
                marginTop: 12, marginBotom: 12, marginRight: 8, marginLeft: 8,
                width: 320
            }}>
            <CardContent>
                <Typography variant="h6">
                    {props.hike.title}
                </Typography>
                <Typography variant="subtitle1">
                    {props.hut.point.address}
                </Typography>
            </CardContent>
        </Card>
    )
}

export {HikerHikesPage}