import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import 'styles/views/Login.scss';
import {Dropdown} from 'rsuite';

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
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [publisher, setPublisher] = useState('');
    const [sellerid, setSellerid] = useState(id);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');



    //function for uploading book
    const doUploadBook = async () => {
        try {
            setSellerid(id);
            const requestBody = JSON.stringify({name, author, description, publisher, sellerid, category, price});
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
            const fileSizeInBytes = selectedImage.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMB > 1) {
                alert('The size of uploaded images cannot exceed 1MB.');
                e.target.value = null; // clear the input field
                return;
            }
            setImage(selectedImage);
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('bi').src = e.target.result;
            }
            reader.readAsDataURL(selectedImage);
        }
    };



    const handleSelect = eventKey => {
        setCategory(eventKey);
    }

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
                    <p>Book Category*:</p>
                    <Dropdown title={category}
                              value={category}
                              onSelect={handleSelect}
                    >
                        <Dropdown.Item eventKey={'Science'}>Science</Dropdown.Item>
                        <Dropdown.Item eventKey={'History'}>History</Dropdown.Item>
                        <Dropdown.Item eventKey={'Engineering'}>Engineering</Dropdown.Item>
                        <Dropdown.Item eventKey={'Fantasy'}>Fantasy</Dropdown.Item>
                        <Dropdown.Item eventKey={'Adventure'}>Adventure</Dropdown.Item>
                        <Dropdown.Item eventKey={'Mystery'}>Mystery</Dropdown.Item>
                        <Dropdown.Item eventKey={'Tools Book'}>Tools Book</Dropdown.Item>
                        <Dropdown.Item eventKey={'Other'}>Other</Dropdown.Item>
                    </Dropdown>
                    <br/>
                    <br/>
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
                    <FormField
                        label="Price*:"
                        value={price}
                        onChange={n => setPrice(n)}
                    />
                    <div className="edit label">
                        Image*:
                    </div>
                    <br/>
                    <input type="file" id="file" accept="image/*"
                           onChange={handleChange}/>
                    <img id="bi" src="" alt="" style={{width: '200px'}}/>
                    <br/>
                    <br/>
                    <div className="upload book button-container">
                        <Button
                            disabled={!name || !author || !publisher|| !image|| !price|| !category}
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