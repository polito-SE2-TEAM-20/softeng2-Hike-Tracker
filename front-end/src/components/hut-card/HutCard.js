import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '../buttons/Button'
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import hutIcon from '../../Assets/hut-icon.png'
import './hut-card-style.css'
import { APIURL } from "../../API/API";


const HutCard = (props) => {
    const navigate = useNavigate()

    return (
        <div className="zoom">
            <Card sx={{ minWidth: 275, maxWidth: 275 }}>
                <CardContent>
                    <div style={{  display: "flex", justifyContent: "center",  borderRadius: "32px" }}>
                        <img src={APIURL + props.hut.pictures[0]} alt="hutIcon" style={{objectFit: "cover", width: "100vw", height: "150px", borderRadius: "8px"}} />
                    </div>
                    <Typography variant="h5" component="div" style={{ fontFamily: "Unbounded", fontWeight: "100" }}>
                        {props.hut.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {props.hut.point?.address}
                    </Typography>
                    <Typography variant="body2">
                        Price: {props.hut.price}€<br />
                        Number of beds: {props.hut.numberOfBeds} beds<br />
                    </Typography>
                </CardContent>
                {
                    props.editable?
                    
                        <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                    <Button text="Update condition linked hikes" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate('/hutWorkerHuts/linkedHikes') }} />
                </div> 
                : 
                <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                    <Button text="Read more about" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/showhut/${props.hut.id}`) }} />
                </div>
                    

                }
                
                {
                props.editable ?
                <div style={{ marginRight: "12px", marginBottom: "12px", display: "flex", justifyContent: "right" }}>
                    <Button text="Edit" fontSize="14px" color="#1a1a1a" textColor="white" navigate={() => { navigate(`/edithut/${props.hut.id}`) }} />
                </div> : <></>
                }
                
            </Card >
        </div>
    );
}

export default HutCard