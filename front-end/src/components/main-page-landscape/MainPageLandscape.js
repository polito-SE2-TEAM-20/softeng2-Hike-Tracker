import { Col, Row } from 'react-bootstrap'
import './mpl-style.css'

const MainPageLandscape = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Row style={{ marginTop: "120px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "center"}}>
                <p className="txt-931" style={{
                    width: "1000px", color: "#1a1a1a", paddingBottom: "25px",
                    margin: "auto", display: "flex", justifyContent: "center",
                    borderRadius: "40px"
                }}>
                    where will your next adventure be?
                </p>
            </Row>
        </div >
    )
}

export default MainPageLandscape