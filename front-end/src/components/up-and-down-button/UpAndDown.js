import { Col, Row } from "react-bootstrap";

const UpAndDown = (props) => {
    return (
        <div className="uadFrame">
            <Row style={{width: "fit-content", margin: "auto"}}>
                <Col style={{padding: "1px"}}>
                    <div style={{backgroundColor: "white", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px"}}>
                        <svg onClick={() => {props.fun.setTitle(0); 
                        props.fun.setExpectedTime(0); 
                        props.fun.setLength(0); 
                        props.fun.setDifficulty(0); 
                        props.fun.setAscent(0); 
                        props.properFun(1)} } xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#1a1a1a" class="bi bi-arrow-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                        </svg>
                    </div>
                </Col>
                <Col style={{padding: "1px"}}>
                    <div style={{backgroundColor: "white", borderTopRightRadius: "6px", borderBottomRightRadius: "6px"}}>
                        <svg onClick={() => {props.fun.setTitle(0); 
                        props.fun.setExpectedTime(0); 
                        props.fun.setLength(0); 
                        props.fun.setDifficulty(0); 
                        props.fun.setAscent(0); 
                        props.properFun(-1)} } xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#1a1a1a" class="bi bi-arrow-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                        </svg>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default UpAndDown