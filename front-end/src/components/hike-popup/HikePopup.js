const HikePopup = (props) => {
    return(
        <div>
            <p>{props.elem.name}</p>
            <p>Latitude: {props.elem.gps.latitude}</p>
            <p>Longitude: {props.elem.gps.longitude}</p>
        </div>
    );
}

export default HikePopup