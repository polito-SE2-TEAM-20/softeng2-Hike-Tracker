import './hikepopup-style.css'

const HikePopup = (props) => {
    return(
        <div>
            <div className='popup-line'><b>{props.elem.name}</b></div>
            <br></br>
            <div className='popup-line'>Latitude: {props.elem.gps.latitude}</div>
            <div className='popup-line'>Longitude: {props.elem.gps.longitude}</div>
        </div>
    );
}

export default HikePopup