import { Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import Button from '../buttons/Button';
import './hikepopup-style.css'

const HikePopup = (props) => {
    const navigate = useNavigate()
    return(
        <div>
            <div className='popup-line'><b>{props.hike.title}</b></div>

            <Divider style={{marginTop: "2px", marginBottom: "2px"}} />

            <div className='popup-line'>{props.hike.region} - {props.hike.province}</div>

            <Divider style={{marginTop: "2px", marginBottom: "2px"}} />

            <div className='popup-line'>Length: {props.hike.length}km</div>

            <Divider style={{marginTop: "2px", marginBottom: "2px"}} />

            <div className='popup-line'>Latitude: {props.hike.positions[0][0]}</div>
            <div className='popup-line'>Longitude: {props.hike.positions[0][1]}</div>

            <Divider style={{marginTop: "2px", marginBottom: "2px"}} />

            <Button text="See details" color="black" textColor="white" fontSize="12px" navigate={() => {navigate(`/showhike/${props.hike.id}`)}} />

            <Divider style={{marginTop: "2px", marginBottom: "2px"}} />

            <Button text="Zoom on it" color="black" textColor="white" fontSize="12px" navigate={() => {props.OnClickSelectHike(props.hike.id)}} />
        </div>
    );
}

export default HikePopup