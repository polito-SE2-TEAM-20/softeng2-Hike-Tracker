import React from 'react'
import './Login.css'
import { Form, Button, Alert, Modal, Col, Row, FormGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LoginForm(props) {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();


	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage('');
		const credentials = { username, password };
		let valid = true;
		if (username === '' || password === '') {
			valid = false;
			setErrorMessage('Wrong username or password');
			setShow(true);
		}
		if (valid) {
			props.login(credentials, setShow, setErrorMessage);
		} else {
			setErrorMessage('Username and password cannot be empty');
			setShow(true);
		}
	};
    return (<>
    <div className={`LoginPage ${props.className}`}>
        <Row type="flex" justify="center" align="middle" style={{minHeight: '20vh'}}>
        <div className='CircleSopra'>
				<div className='Rectangle1'/>
				<div className='Rectangle2'/>
				<div className='Rectangle3'/>
			</div>
        </Row>
        <Row type="flex" justify="center" align="middle" style={{minHeight: '50vh'}}>
            
        
        <Col>
        <Form justify="center" onSubmit={handleSubmit} style={{marginTop: '2em'}} >
            <div justify="center" className="LogInBox">
            <Form.Group>
			<div className='HeaderLogIn'>
					<span className='SignIntoaccessyouraccount'>Sign In to access your account!</span>
					<span className='Welcomeback'>Welcome back!</span>
					<span className='SIGNIN'>SIGN IN</span>
				</div>
				</Form.Group>

            
        <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          <div className='InputForm'>
            <Form.Group controlId='username'>
                <Form.Label className='Email'>Email</Form.Label>
                <Form.Control type='text' className='InputEmail' value={username} onChange={(ev) => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group controlId='password'>
                <Form.Label className='Password' >Password</Form.Label>
                <Form.Control type='password'className ='InputPassword' value={password} onChange={ev => setPassword(ev.target.value)} />
            
            </Form.Group>
            </div>
            <FormGroup className='ButtonLogIn'>
                <Button type="submit" className='button'>LOGIN</Button>
            </FormGroup>
            <FormGroup className='ButtonAnnulla'>
                <Button className='button2' onClick={()=> navigate('/')}>ANNULLA</Button>
            </FormGroup>
            </div>
        </Form>
        </Col>
        
        
        </Row>
        <Row>
        <div className='DonthaveanaccountyetCreateone'>Don’t have an account yet? Create one</div>
        </Row>
        </div></>);
}

export { LoginForm };

