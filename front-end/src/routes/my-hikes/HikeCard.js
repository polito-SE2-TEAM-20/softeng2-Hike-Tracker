import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '../../components/buttons/Button'
import Typography from '@mui/material/Typography';
import touristIcon from '../../Assets/tourist-icon.png'
import hikerIcon from '../../Assets/hiker-icon.png'
import proIcon from '../../Assets/pro-icon.png'
import { useNavigate } from 'react-router';
import { HikeDifficultyLevel } from '../../lib/common/Hike';
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours';
import { Grid } from '@mui/material';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

const HikeCard = (props) => {
    const navigate = useNavigate();

    return (
        <Card style={{ minWidth: 275, maxWidth: 275 }}>
            <CardContent>

                {HikeItemImage(props.hike.difficulty)}

                <Typography variant="h5" component="div" style={{ fontFamily: "Bakbak One, display", fontWeight: "100" }}>
                    {props.hike.title}
                </Typography>
                <Typography color="text.secondary">
                    {props.hike.province} {bull} {props.hike.region}
                </Typography>
                <Typography variant="body2">
                    Length: {(Math.round(props.hike.length * 10) / 10000).toFixed(2)}km<br />
                    Expected time: {fromMinutesToHours(props.hike.expectedTime)}<br />
                    Ascent: {props.hike.ascent}m<br />
                </Typography>
            </CardContent>
            <Grid
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="flex-end"
                    style={{ marginRight: 12, marginLeft: 12}}
                    >
                    {
                        props.editable && 
                        <Grid style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                            <Button text="Edit" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/edithike/${props.hike.id}`) }} />
                        </Grid>
                    }

                    <Grid style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                        <Button text="Read more about" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/showhike/${props.hike.id}`) }} />
                    </Grid>

                </Grid>
        </Card >
    );
}

function HikeItemImage(difficulty) {
    let icon;
    let text;
    let bgColor;
    switch (difficulty) {
        case HikeDifficultyLevel.Tourist:
            icon = touristIcon;
            text = "Tourist";
            bgColor = "#55B657";
            break;
        case HikeDifficultyLevel.Hiker:
            icon = hikerIcon;
            text = "Hiker";
            bgColor = "#1a79aa";
            break;
        case HikeDifficultyLevel.Pro:
            icon = proIcon;
            text = "Pro";
            bgColor = "#FA6952";
            break;
    };

    return (<>
        <div style={{ backgroundColor: bgColor, display: "flex", justifyContent: "center", margin: 4, padding: 24, borderRadius: 12 }}>
            <img src={icon} alt={text} width="72" height="72" />
        </div>
        <Typography style={{ fontWeight: "600", fontSize: 14, textAlign: "center" }} color="text.secondary" gutterBottom>
            <div style={{ display: "inline-block" }}>Difficulty level: <div style={{ backgroundColor: bgColor, color: "white", borderRadius: 8, paddingLeft: 12, paddingTop: 4, paddingBottom: 4, paddingRight: 12, width: "fit-content", display: "inline-block", marginLeft: 8 }}>{text}</div></div>
        </Typography>
    </>)
}

export default HikeCard