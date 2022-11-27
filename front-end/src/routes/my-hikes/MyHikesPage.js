import { useEffect, useState } from 'react';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HikeCard from '../../components/hike-card/HikeCard';
import { getMyHikesAsLocalGuide } from '../../API/me';
import HikeItemLoadingEffect from './HikeItemLoadingEffect';

function MyHikesPage(props) {
    const [myHikes, setMyHikes] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        getMyHikesAsLocalGuide().then((hikes) => {
            setMyHikes(hikes)
            setLoading(false)
        });
    }, [])

    return (
        <>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} />
            <Grid container style={{ marginTop: 80 }}>
                <Grid item >
                    <Grid container style={{justifyContent: "center"}}>
                        {/* Loading effects */}
                        {loading && 
                            [1,1,1,1,1,1,1,1,1].map(item => {
                                return <HikeItemLoadingEffect/>
                            })
                        }
                        
                        {/* Showing that you haven't created any hike */}
                        {(!loading && myHikes.length == 0) && 
                            <Typography fontFamily={"Bakbak One, display"} fontWeight="600">
                                You haven't created any hikes.
                            </Typography>
                        }

                        {/* Shwoing hikes when it is not loading and you created at least one hike before */}
                        {(!loading && myHikes.length > 0) &&
                            myHikes.map(hike => {
                                return (
                                    <Grid item style={{ marginLeft: "8px", marginRight: "8px", marginBottom: "4px", marginTop: "4px" }}>
                                        <HikeCard hike={hike} editable="true" />
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export {MyHikesPage}