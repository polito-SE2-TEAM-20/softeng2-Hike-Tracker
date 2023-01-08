import API from '../../API/API.js';

import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import HikeItemLoadingEffect from './HikeItemLoadingEffect';
import emptyStateImage from '../../Assets/empty-state.jpg'
import { useNavigate } from 'react-router';
import HikeCard from '../../components/hike-card/HikeCard.js';
import { UserRoles } from '../../lib/common/UserRoles'


function MyHikesPage(props) {
    const [myHikes, setMyHikes] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true);
        API.getHikesForLocalGuide().then((hikes) => {
            setMyHikes(oldHikes => hikes)
            setLoading(false)
        });
    }, [props.rowsAffected])

    useEffect(()=>{
        if(props.rowsAffected){
            console.log(props.rowsAffected);
            props.setRowsAffected(false);
        }
      }, []);

      if (
        props.user?.role !== UserRoles.LOCAL_GUIDE) {
        navigate('/unauthorized')
      }


    return (
        <>
            <Grid container style={{justifyContent: "center", marginTop: 80}}>
                {/* Loading effects */}
                {loading && 
                    [1,1,1,1,1,1,1,1,1].map(item => {
                        return <HikeItemLoadingEffect/>
                    })
                }
                
                {/* Showing that you haven't created any hike */}
                {(!loading && myHikes.length == 0) && 
                    <NoItemView navigate={navigate}/>
                }

                {/* Shwoing hikes when it is not loading and you created at least one hike before */}
                {(!loading && myHikes.length > 0) &&
                    myHikes.map(hike => {
                        return (
                            <Grid item style={{ marginLeft: "8px", marginRight: "8px", marginBottom: "4px", marginTop: "4px" }}>
                                <HikeCard hike={hike} editable="true" delete="true" deleteHike={props.deleteHike}/>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
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
                You haven't created any hikes.
            </Typography>
        </Grid>
    )
}

export {MyHikesPage}