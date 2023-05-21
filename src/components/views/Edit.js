import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from 'models/User';
import Book from "../../models/Book";
import 'styles/views/Login.scss';

/*
This component is for user profile editing
 */
const FormField = props => {
    return (
        <div className="edit field">
            <label className="edit label">
                {props.label}
            </label>
            <input
                defaultValue
                className="edit input"
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

//Edit component
const Edit = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    //values relate to user
    const {id} = useParams();
    const [user, setUser] = useState(new User());
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');


    //fetch existing user information from server side
    useEffect(() => {
        async function fetchData() {

            const response = await api.get('/users/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(new User(response.data));
            setUsername(user.username);
            setAddress(user.address);
            setEmail(user.email)
        }

        fetchData().catch((err) =>{
            console.error(err)
        });
    }, []);

    //function for updating profile
    const doUpdateProfile = async () => {
        try {
            const requestBody = JSON.stringify({id, username, address, email, password});
            await api.put('/users/' + id, requestBody);

            // Update successfully worked --> navigate to the route /profile
            history.push(`/profile/` + id);
        } catch (error) {
            alert(`Something went wrong during the Profile update: \n${handleError(error)}`);
        }
    };


    //back to profile page
    const backToOverview = () => {
        history.push(`/profile/` + id);
    }

    const handleChange = (e) => {
        const file = e.target.files[0];
        //setImage(file);
        const reader = new FileReader();
        reader.onload = event => {
            document.getElementById('bi').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    return (
        <div>
        <Header height="100"/>
    <div className="edit-container">
        <div className="Update container">
            <div className="update form">
                <FormField
                    defaultValue={username}
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
                    defaultValue={email}
                    label="Email"
                    value={email}
                    onChange={n => setEmail(n)}
                />

                <FormField
                    defaultValue={address}
                    label="Address"
                    value={address}
                    onChange={n => setAddress(n)}
                />

                <br/>
                <div className="update Profile button-container">
                    <Button
                        disabled={!username || !email || !password}
                        width="100%"
                        onClick={() => doUpdateProfile()}
                    >
                        Update Profile
                    </Button>
                    <br/>
                    <br/>
                </div>

                <Button
                    width="100%"
                    onClick={() => backToOverview()}
                >
                    Back to User Overview
                </Button>
            </div>
        </div>
    </div>
        </div>
)
    ;
}

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Update Profile</h1>

    </div>
);

export default Edit;