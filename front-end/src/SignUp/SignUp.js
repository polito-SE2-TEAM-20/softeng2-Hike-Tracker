import React from 'react'
import { useState } from 'react';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';

import { Form, Button, Alert, Modal, Col, Row, FormGroup } from 'react-bootstrap';
function SignUp(props) {

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        let valid = true;
        if (confirmPassword !== password) {
            valid = false;
            setErrorMessage('Password do not match');
            setShow(true);
        }
        if (valid) {
            const credentials = { email: email, firstName: firstName, lastName: lastName, password: password, role: role }
            props.doRegister(credentials, setShow, setErrorMessage);
        }
        console.log(firstName, lastName, email, password, confirmPassword);
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
                                <Form.Group controlId='firstname'>
                                    <Form.Label className='Email'>FirstNmame</Form.Label>
                                    <Form.Control type='text' className='InputEmail' value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
                                </Form.Group>
                                <Form.Group controlId='lastname'>
                                    <Form.Label className='Email'>LastName</Form.Label>
                                    <Form.Control type='text' className='InputEmail' value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
                                </Form.Group>
                                <Form.Group controlId='role'>
                                    <Form.Label className='Email'>Role</Form.Label>

                                    <Form.Select required={true} onChange={(e) => { setRole(e.target.value); console.log(e.target.value) }}>
                                        <option></option>

                                        <option value="0">Hiker</option>
                                        <option value="1">Friend</option>
                                        <option value="2">Local Guide</option>
                                        <option value="3">Platform Manager</option>
                                        <option value="4">Hut worker</option>
                                        <option value="5">Emergency Operator</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId='username'>
                                    <Form.Label className='Email'>Email</Form.Label>
                                    <Form.Control type='text' className='InputEmail' value={email} onChange={(ev) => setEmail(ev.target.value)} />
                                </Form.Group>
                                <Form.Group controlId='password'>
                                    <Form.Label className='Password' >Password</Form.Label>
                                    <Form.Control type='password' className='InputPassword' value={password} onChange={ev => setPassword(ev.target.value)} />

                                </Form.Group>
                                <Form.Group controlId='confirm-password'>
                                    <Form.Label className='Password' >Repeat Password</Form.Label>
                                    <Form.Control type='password' className='InputPassword' value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />

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
                <div className='DonthaveanaccountyetCreateone'>Already have an account? Sign In</div>
            </Row>
        </div>
    );
}



export {SignUp}

/*
        <div className="form">
            <div className="form-body">
                <div className="username">
                    <label className="form__label" for="firstName">First Name </label>
                    <input className="form__input" type="text" value={firstName} onChange = {(e) => handleInputChange(e)} id="firstName" placeholder="First Name"/>
                </div>
                <div className="lastname">
                    <label className="form__label" for="lastName">Last Name </label>
                    <input  type="text" name="" id="lastName" value={lastName}  className="form__input" onChange = {(e) => handleInputChange(e)} placeholder="LastName"/>
                </div>
                <div className="role">
                    <label className="form__label" for="role">Role </label>
                    <input  type="text" name="" id="role" value={role}  className="form__input" onChange = {(e) => handleInputChange(e)} placeholder="Role"/>
                </div>
                <div className="email">
                    <label className="form__label" for="email">Email </label>
                    <input  type="email" id="email" className="form__input" value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
                </div>
                <div className="password">
                    <label className="form__label" for="password">Password </label>
                    <input className="form__input" type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
                </div>
                <div className="confirm-password">
                    <label className="form__label" for="confirmPassword">Confirm Password </label>
                    <input className="form__input" type="password" id="confirmPassword" value={confirmPassword} onChange = {(e) => handleInputChange(e)} placeholder="Confirm Password"/>
                </div>
            </div>
            <div className="footer">
                <button onClick={()=>handleSubmit()} type="submit" className="btn">Register</button>
            </div>
        </div>*/

        /*

	const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "firstName"){
            setFirstName(value);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }
        if(id === "role"){
            setRole(value);
        }

    }*/
