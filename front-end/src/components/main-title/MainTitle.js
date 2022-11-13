import './main-title-style.css'

const MainTitle = (props) => {
    return (
        <div onClick={props.navigate} className="main-title" style={{ color: props.color, fontSize: props.size }}>
            Hike Tracking
        </div>
    );
}

export default MainTitle