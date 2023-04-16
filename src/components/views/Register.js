import React, {useEffect, useState} from 'react';
import { Dropdown } from 'rsuite';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import User from 'models/User';
import 'styles/views/Login.scss';
import Book from "../../models/Book";
import Cart from "../../models/Cart";

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Register = () => {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [books, setBooks] = useState([]);
    const quantity = 0;
    const prices = 0;
    const [userId, setUserId] = useState('');

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({username, password, email});
            const response = await api.post('/users', requestBody);
            alert('Register Successfully!');

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('id', user.id);

            setUserId(user.id);
            const data = {
                    list: null
                  };
            const requestBody1 = {
                                   list: data.list || [],
                                   prop1: 0,
                                   prop2: 0,
                                   userId: user.id
                                 };
            const response1 = await api.post('/cart', requestBody1);
            const cart = new Cart(response1.data);
            alert('Create Cart Successfully!');
            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/login`);
        } catch (error) {
            alert(`Something went wrong during the Registration: \n${handleError(error)}`);
        }
    };

    const backtologin = () => {
        history.push(`/login`);
    }

    return (
        <BaseContainer>
            <div className="login container">
                <p>REGISTER</p>
                <div className="login form">
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <FormField
                        label="Email"
                        value={email}
                        onChange={n => setEmail(n)}
                    />
                    <div className="login registration-button-container">
                        <Button
                            disabled={!username || !password || !email}
                            width="50%"
                            onClick={() => doRegistration()}
                        >
                            Register
                        </Button>
                    </div>
                    <div className="login button-container">
                        <Button
                            width="50%"
                            onClick={() => backtologin()}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default Register;