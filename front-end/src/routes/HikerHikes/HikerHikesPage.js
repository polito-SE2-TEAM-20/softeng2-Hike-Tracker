import { CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import API from "../../API/API"
import { UserHikeState } from "../../lib/common/Hike"
import HikeItem from "./HikeItem"
import emptyStateImage from '../../Assets/empty-state.jpg'
import HikeItemLoadingEffect from "../my-hikes/HikeItemLoadingEffect"
import { useNavigate } from 'react-router';
import { UserRoles } from '../../lib/common/UserRoles'

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

    const navigate = useNavigate()

    if (props.user?.role !== UserRoles.HIKER) {
        navigate('/unauthorized')
    }

    return (
        <>
            {
                isLoading &&
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center">
                        {
                            [1,1,1,1,1,1,1,1,1,1].map(item => {
                                return <HikeItemLoadingEffect/>
                            })
                        }
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
                                                <HikeItem trackHike={hike} />
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
                                                <HikeItem trackHike={hike} />
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </>
                    }

                    {
                        ((unfinishedHikes !== null && unfinishedHikes.length === 0) &&
                        (finishedHikes !== null && finishedHikes.length === 0)) &&
                        <NoItemView/>
                    }

                </Grid>
            }
        </>
    )
}

function NoItemView(props) {
    return (
        <Grid 
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center">
            <Grid item>
                <img
                    src={emptyStateImage}
                    loading="lazy"
                />
            </Grid>
            <Typography item fontFamily={"Bakbak One, display"} fontWeight="600">
                You haven't started any hike.
            </Typography>
        </Grid>
    )
}


export { HikerHikesPage }