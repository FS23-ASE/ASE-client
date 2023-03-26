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
        <div className="Update field">
            <label className="update label">
                {props.label}
            </label>
            <input
                defaultValue
                className="update input"
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

    //values relate to book
    const [book, setBook] = useState(new Book());
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [publisher, setPublisher] = useState('');
    const [sellerid, setSellerid] = useState(id);
    const [image, setImage] = useState(null);


    //fetch existing user information from server side
    useEffect(() => {
        async function fetchData() {

        const response = await api.get('/users/'+id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(new User(response.data));
        setUsername(user.username);
        setAddress(user.address);
        setEmail(user.email)
        }
        fetchData();
    }, []);

    //function for updating profile
    const doUpdateProfile = async () => {
        try {
            const requestBody = JSON.stringify({id, username, address, email, password});
            await api.put('/users/'+id, requestBody);

            // Update successfully worked --> navigate to the route /profile
            history.push(`/game/profile/`+id);
        } catch (error) {
            alert(`Something went wrong during the Profile update: \n${handleError(error)}`);
        }
    };

    //function for uploading book
    const doUploadBook = async () => {
        try {
            setSellerid(id);
            const requestBody = JSON.stringify({name, author, description, publisher, sellerid, image});
            await api.post('/books', requestBody);
            alert('Upload Successfully');
        } catch (error) {
            alert(`Something went wrong during the book upload: \n${handleError(error)}`);
        }
    };


    //back to profile page
    const backToOverview = async () => {
        history.push(`/profile/`+id);}

    const handleChange = (e)=> {
        const file = e.target.files[0];
        //setImage(file);
        const reader = new FileReader();
        reader.onload = event => {
            document.getElementById('bi').src = event.target.result;
        };
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
        }
    }

    return (
        <BaseContainer className="game container">
            <p className="game paragraph">
                Edit Your Profile:
            </p>
            <div className="Update container">
                <div className="update form">
                    <FormField
                        defaultValue={username}
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        label="Password"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        defaultValue={email}
                        label="Email"
                        value={email}
                        onChange={n => setEmail(n)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        defaultValue={address}
                        label="Address"
                        value={address}
                        onChange={n => setAddress(n)}
                    />
                    <br/>
                    <br/>
                    <input type="file" id="file" accept="image/*"
                           onChange={handleChange}/>
                    <img id="bi" src="" alt="" style={{width: '500px'}}/>
                    <br/>
                    <br/>
                    <FormField
                        label="Book name"
                        value={name}
                        onChange={un => setName(un)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        label="Author"
                        value={author}
                        onChange={n => setAuthor(n)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        label="Publisher"
                        value={publisher}
                        onChange={n => setPublisher(n)}
                    />
                    <br/>
                    <br/>
                    <FormField
                        label="Description"
                        value={description}
                        onChange={n => setDescription(n)}
                    />
                    <br/>
                    <br/>
                    <div className="update Profile button-container">
                        <Button
                            disabled={!username  || !email || !password}
                            width="50%"
                            onClick={() => doUpdateProfile()}
                        >
                            Update Profile
                        </Button>
                    </div>
                    <div className="upload book button-container">
                        <Button
                            disabled={!name || !author || !publisher}
                            width="50%"
                            onClick={() => doUploadBook()}
                        >
                            Upload Book
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => backToOverview()}
                        >
                            Back to User Overview
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}



export default Edit;