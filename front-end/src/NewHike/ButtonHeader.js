import '../components/buttons/button-style.css';
import { useNavigate } from "react-router-dom";

const Button = (props) => {
    return (
        <div onClick={props.navigate} className="button-frame unselectable" style={{backgroundColor: props.color, color: props.textColor}}>
            <div className="button-text" style={{fontSize: props.size}}>
                {props.text}
            </div>
        </div>
    );
}

export default Button