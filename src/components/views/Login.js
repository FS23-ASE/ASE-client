import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "components/views/Header";


/*
Component for login and registration
 */
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

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  //Registration function
  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({username, password, email});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the Registration: \n${handleError(error)}`);
    }
  };

  //Login function
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      console.log(requestBody);
      const response = await api.put('/users/login', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  //Check the format of email input
  /*
  const handleEmail =(em) =>{
    let value = em;
    if(!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value))) {
      console.log('Please Input Correct Email');
    }else{
      setEmail(em);
    }
  }

   */


  return (
    <BaseContainer>
      <div>
      <Header height="100"/>
      <div className="login container">
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
          <div className="registration button-container">
            <Button
              disabled={!username || !password || !email}
              width="100%"
              onClick={() => doRegistration()}
            >
              Registration
            </Button>
          </div>
          <div className="login button-container">
            <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
