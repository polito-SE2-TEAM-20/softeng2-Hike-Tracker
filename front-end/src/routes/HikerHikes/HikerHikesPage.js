import { CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import API from "../../API/API"
import { UserHikeState } from "../../lib/common/Hike"
import HikeItem from "./HikeItem"

function HikerHikesPage(props) {

    const [isLoading, setLoading] = useState(false)
    const [finishedHikes, setFinishedHikes] = useState([])
    const [unfinishedHikes, setUnFinishedHikes] = useState([])


    useEffect(() => {

        const getHikes = async () => {
            setLoading(true)
            const allHikes = await API.getAllUserTrackingHikes(UserHikeState.ALL);
            setFinishedHikes(allHikes.filter((item => item.finishedAt !== null)))
            setUnFinishedHikes(allHikes.filter((item => item.finishedAt === null)))
            setLoading(false)
        }

        getHikes()
    }, [])



    return (
        <>
            {
                isLoading &&
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            }
            {
                !isLoading &&
                <Grid 
                    container
                    style={{marginRight: 32, marginLeft: 32, marginTop: 24, margin: 24}}>
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
                                                <HikeItem hike={hike} />
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
                                                <HikeItem hike={hike} />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </>
                    }

                </Grid>
            }
        </>
    )
}

export { HikerHikesPage }