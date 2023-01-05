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
import DeleteIcon from '@mui/icons-material/Delete';
import { APIURL } from "../../API/API";


import './hike-card-style.css'

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
        <div className="zoom">
            <Card style={{ minWidth: 275, maxWidth: 275 }}>
                <CardContent>

                    {HikeItemImage(props.hike.difficulty, props.hike.pictures)}

                    <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
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
                <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                    <Button text="Read more about" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/showhike/${props.hike.id}`) }} />
                </div>
                {
                    props.editable ? <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                        <Button text="Edit" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/edithike/${props.hike.id}`) }} />
                    </div> : <></>
                }
                {
                    props.delete ? <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "left" }}>
                       <DeleteIcon color="#1a1a1a" onClick={() => {props.deleteHike(props.hike.id)}}></DeleteIcon>
                   </div> : <></>
                }
                {
                    props.deleteFromSaved ? <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                       <Button text="Delete from Saved" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => {props.deleteHikeFromSaved(props.hike.id)}}></Button>
                   </div> : <></>
                }
            </Card >
        </div>
    );
}

function HikeItemImage(difficulty, pictures) {
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
        default: break;
    };

    return (<>
        <div style={{ display: "flex", justifyContent: "center", margin: 1, borderRadius: 12 }}>
            <img src={APIURL + pictures[0]} alt={text} style={{objectFit: "cover", width: "100vw", height: "150px", borderRadius: "8px"}} />
        </div>
        <Typography style={{ fontFamily: "Unbounded", fontWeight: "600", fontSize: 14, textAlign: "center", marginTop: "12px" }} color="text.secondary" gutterBottom>
            <div style={{ display: "inline-block" }}>Difficulty level: <div style={{ backgroundColor: bgColor, color: "white", borderRadius: 8, paddingLeft: 12, paddingTop: 4, paddingBottom: 4, paddingRight: 12, width: "fit-content", display: "inline-block", marginLeft: 8 }}><b>{text}</b></div></div>
        </Typography>
    </>)
}

export default HikeCard