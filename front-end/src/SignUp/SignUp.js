import React from 'react'
import { useState } from 'react';
import './SignUp.css'

import { useNavigate } from 'react-router-dom';

import { Form, Button, Alert, Col, Row, FormGroup, NavLink, FormSelect } from 'react-bootstrap';
function SignUp(props) {

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roleStr, setRoleStr] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        let valid = true;
        if(firstName==='' || lastName ===''){
            setErrorMessage('Please insert a valid name');
            setShow(true);
            valid = false;
        }
        if(email===''){
            setErrorMessage('Please insert a valid email');
            setShow(true);
            valid = false;
        }
        if(password===''){
            setErrorMessage('Please insert a valid password');
            setShow(true);
            valid = false;
        }
        if(confirmPassword===''){
            setErrorMessage('Please confirm your password');
            setShow(true);
            valid = false;
        }
        if (confirmPassword !== password) {
            valid = false;
            setErrorMessage('Password do not match');
            setShow(true);
        }
        if (valid) {
            const role = parseInt(roleStr);
            const credentials = { email, firstName, lastName, password, role };
            console.log(credentials);
            props.doRegister(credentials, setShow, setErrorMessage);

        console.log(firstName, lastName, email, password, confirmPassword, role);
        }
    }

    return (
        <div className={`LoginPage ${props.className}`}>
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '20vh' }}>
                <div className='CircleSopra'>
                    <div className='Rectangle1' />
                    <div className='Rectangle2' />
                    <div className='Rectangle3' />
                </div>
            </Row>
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '50vh' }}>


                <Col>
                    <Form justify="center" onSubmit={handleSubmit} style={{ marginTop: '2em' }} >
                        <div justify="center" className="LogInBox">
                            <Form.Group>
                                <div className='HeaderLogIn'>
                                    <span className='SignIntoaccessyouraccount'>Sign Up to create your account!</span>
                                    <span className='Welcomeback'>Welcome!</span>
                                    <span className='SIGNIN'>SIGN UP</span>
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
                                <Row>
                                
                                <Form.Group className="col-6" controlId='firstName'>
                                    <Form.Label className='Name'>First Name</Form.Label>
                                    <Form.Control type='text' placeholder="Insert name" className='InputName' required value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
                                </Form.Group>
                               
                                <Form.Group className="col-6" controlId='lastName'>
                                    <Form.Label className='Name'>Last Name</Form.Label>
                                    <Form.Control type='text' placeholder="Insert last name" className='InputName' value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
                                </Form.Group>
                                </Row>
                                <Form.Group controlId='roleStr'>
                                    <Form.Label className='Name'>Role</Form.Label>
                                    <div className="form-row">
                                    <FormSelect aria-label="Type of Iscription" className='InputName'  required={true} onChange={(e) => { setRoleStr(e.target.value); console.log(e.target.value) }}>
                                        <option>Open to choose the type of Iscription</option>

                                        <option value="0">Hiker</option>
                                        <option value="2">Local Guide</option>
                                        <option value="3">Platform Manager</option>
                                        <option value="4">Hut worker</option>
                                        <option value="5">Emergency Operator</option>
                                    </FormSelect>
                                    </div>
                                </Form.Group>

                                <Form.Group controlId='email'>
                                    <Form.Label className='Name'>Email</Form.Label>
                                    <Form.Control type='text' placeholder="Insert email" className='InputName' value={email} onChange={(ev) => setEmail(ev.target.value)} />
                                </Form.Group>
                                <Form.Group controlId='password'>
                                    <Form.Label className='Name' >Password</Form.Label>
                                    <Form.Control type='password' placeholder="Insert password" className='InputName' value={password} onChange={ev => setPassword(ev.target.value)} />

                                </Form.Group>
                                <Form.Group controlId='confirmPassword'>
                                    <Form.Label className='Name' >Repeat Password</Form.Label>
                                    <Form.Control type='password'  placeholder="Repeat Password" className='InputName' value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />

                                </Form.Group>
                            </div>
                            <FormGroup className='ButtonLogIn'>
                                <Button type="submit" className='button'>SignUp</Button>
                            </FormGroup>
                            <FormGroup className='ButtonAnnulla'>
                                <Button className='button2' onClick={() => navigate('/')}>ANNULLA</Button>
                            </FormGroup>
                        </div>
                    </Form>
                </Col>


            </Row>
            <Row>
                <div className='DonthaveanaccountyetCreateone'>Already have an account? <NavLink href="/login">Sign in</NavLink></div>
            </Row>
        </div>
    );
}



export {SignUp}