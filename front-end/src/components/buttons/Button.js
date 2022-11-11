import './button-style.css'

const Button = (props) => {
    return (
        <div className="button-frame" style={{backgroundColor: props.color, color: props.textColor}}>
            <div className="button-text" style={{fontSize: props.size}}>
                {props.text}
            </div>
        </div>
    );
}

export default Button