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
const Upload = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    //values relate to user
//values relate to book
    const {id} = useParams();
    const [book, setBook] = useState(new Book());
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [publisher, setPublisher] = useState('');
    const [sellerid, setSellerid] = useState(id);
    const [image, setImage] = useState(null);



    //function for uploading book
    const doUploadBook = async () => {
        try {
            setSellerid(id);
            const requestBody = JSON.stringify({name, author, description, publisher, sellerid});
            const response = await api.post('/books', requestBody);
            const bookid=response.data.id;
            const formData = new FormData();
            if (image) {
                formData.append("image", image);
            }
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            await api.put(`/books/${bookid}`, formData, config);
            alert('Upload Successfully');
            history.push(`/profile/`+id);
        } catch (error) {
            alert(`Something went wrong during the book upload: \n${handleError(error)}`);
        }
    };


    //back to profile page
    const backToOverview = async () => {
        history.push(`/profile/`+id);}

    const handleChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);
            const reader = new FileReader();
            reader.onload = () => {
                //setPreview(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    return (
        <div>
        <Header height="100"/>
        <div className="edit-container">
            <div className="Update container">
                <div className="update form">
                    <br/>
                    <FormField
                        label="Book name*:"
                        value={name}
                        onChange={un => setName(un)}
                    />
                    <FormField
                        label="Author*:"
                        value={author}
                        onChange={n => setAuthor(n)}
                    />
                    <FormField
                        label="Publisher*:"
                        value={publisher}
                        onChange={n => setPublisher(n)}
                    />
                    <FormField
                        label="Description:"
                        value={description}
                        onChange={n => setDescription(n)}
                    />
                    <div className="edit label">
                        Image:
                    </div>
                    <br/>
                    <input type="file" id="file" accept="image/*"
                           onChange={handleChange}/>
                    <img id="bi" src="" alt="" style={{width: '200px'}}/>
                    <br/>
                    <br/>
                    <div className="upload book button-container">
                        <Button
                            disabled={!name || !author || !publisher}
                            width="100%"
                            onClick={() => doUploadBook()}
                        >
                            Upload Book
                        </Button>
                        <br/>
                        <br/>
                        <Button
                            width="100%"
                            onClick={() => backToOverview()}
                        >
                            Back to User Overview
                        </Button>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}


const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Upload Books</h1>

    </div>
);



export default Upload;