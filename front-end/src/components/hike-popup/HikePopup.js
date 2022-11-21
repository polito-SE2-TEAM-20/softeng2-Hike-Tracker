import Button from '../buttons/Button';
import './hikepopup-style.css'

const HikePopup = (props) => {
    return(
        <div>
            <div className='popup-line'><b>Test</b></div>
            <br />
            <div className='popup-line'>Latitude: {props.elem[0]}</div>
            <div className='popup-line'>Longitude: {props.elem[1]}</div>
            <br />
            <Button text="See details" color="black" textColor="white" fontSize="12px" />
        </div>
    );
}

export default HikePopup