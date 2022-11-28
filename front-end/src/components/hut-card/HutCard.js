import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '../buttons/Button'
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import hutIcon from '../../Assets/hut-icon.png'
import './hut-card-style.css'

const HutCard = (props) => {
    const navigate = useNavigate()

    return (
        <Card className="zoom" sx={{ minWidth: 275, maxWidth: 275 }}>
            <CardContent>
                <div style={{ backgroundColor: "#f2f250", display: "flex", justifyContent: "center", margin: "16px", padding: "18px", borderRadius: "32px" }}>
                    <img src={hutIcon} alt="hutIcon" width="75px" height="75px" />
                </div>
                <Typography variant="h5" component="div" style={{ fontFamily: "Bakbak One, display", fontWeight: "100" }}>
                    {props.hut.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {props.hut.point.address}
                </Typography>
                <Typography variant="body2">
                    Price: {props.hut.price}€<br />
                    Number of beds: {props.hut.numberOfBeds} beds<br />
                </Typography>
            </CardContent>
            <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                <Button text="Read more about" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/showhut/${props.hut.id}`) }} />
            </div>
        </Card >
    );
}

export default HutCard