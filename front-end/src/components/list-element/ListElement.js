import './list-element-style.css'
import { Row, Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';

const ListElement = (props) => {
    return (
        <Row className="list-element-row" style={{ background: "white" }}>
            <Col className='list-element-item'>
                <div>{props.tb1}</div>
            </Col>
            <Col className='list-element-item'>
                <div></div>
            </Col>
            <Col className='list-element-item'>
                <div>{props.tb2}</div>
            </Col>
            <Col className='list-element-item'>
                <div></div>
            </Col>
            <Col className='list-element-item'>
                <div>--{">"}</div>
            </Col>
        </Row>
    );
}

export default ListElement