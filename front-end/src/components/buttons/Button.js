import { Button } from "@mui/material";

const HTButton = (props) => {
    return (
        <Button onClick={props.navigate}
            variant="contained"
            style={{
                backgroundColor: props.color, color: props.textColor,
                borderRadius: "24px", fontSize: props.size,
                fontFamily: "Unbounded", fontWeight: "600",
                textTransform: "none"
            }}>
            {props.text}
        </Button>
    );
}

export default HTButton