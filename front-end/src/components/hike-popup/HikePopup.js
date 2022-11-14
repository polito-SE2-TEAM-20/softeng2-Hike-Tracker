import Button from '../buttons/Button';
import './hikepopup-style.css'

const HikePopup = (props) => {
    return(
        <div>
            <div className='popup-line'><b>{props.elem.name}</b></div>
            <br />
            <div className='popup-line'>Latitude: {props.elem.gps.latitude}</div>
            <div className='popup-line'>Longitude: {props.elem.gps.longitude}</div>
            <br />
            <Button text="See details" color="black" textColor="white" fontSize="12px" />
        </div>
    );
}

export default HikePopup