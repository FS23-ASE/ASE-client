import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/User";
import Book from "../../models/Book";



//Present book information
const Book_ = ({book}) => (
    <div className="book container">
        <div>
            {book.image && <img src={book.image} alt="Book image" style={{ width: '200px', height: 'auto' }} />}
            <div className="book name"> {book.name}</div>
            <div className="book author">Author: {book.author}</div>
            <div className="book publisher">Publisher: {book.publisher}</div>
            <div className="book status">Book Status: {book.status.toString()}</div>
        </div>
    </div>
);


const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Personal Homepage</h1>
    </div>
);


Book_.propTypes = {
    book: PropTypes.object
};

const Profile = () => {

    const history = useHistory();

    const [user, setUser] = useState(new User());
    const [books, setBooks] = useState(null);
    const {id} = useParams();

    //back to main page
    const backToGame = async () => {
        history.push('/game');
    }

    //direct to edit page
    const goToEdit = async () => {
        history.push(`/edit/` + id);
    }

    const goToUpload = async () => {
        history.push(`/upload/` + id);
    }


    useEffect(() => {

        //Fetch the user's information from server side
        async function fetchData() {
            try {
                const response = await api.get('/users/' + id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned user and update the state.
                const user_ = new User(response.data);
                setUser(user_);

                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        //Fetch books' information from server side
        // async function fetchBook() {
        //     try {
        //         var seller_id = id;
        //         const response = await api.get('/books/seller/' + seller_id);
        //
        //         await new Promise(resolve => setTimeout(resolve, 1000));
        //
        //         // Get the returned books and update the state.
        //         setBooks(response.data);
        //         books.map(async book => (book.image = await api.get('/books/' + book.id+'/image')));
        //         console.log(response);
        //     } catch (error) {
        //         console.error(`You have not uploaded any book.`);
        //         console.error("Details:", error);
        //         alert("You have not uploaded any book.");
        //     }
        // }
        const fetchBook = async () => {
            var seller_id = id;
            const response = await api.get('/books/seller/' + seller_id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (response.data) {
                const booksWithImagePromises = response.data.map(async book => {
                    const response = await api.get(`/books/${book.id}/image`, { responseType: 'arraybuffer' });
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const url = URL.createObjectURL(blob);
                    return { ...book, image: url };
                });
                const booksWithImage = await Promise.all(booksWithImagePromises);
                setBooks(booksWithImage);
            } else {
                setBooks([]);
            }
        };


        fetchData();
        fetchBook()
    }, []);

    let content = <Spinner/>;
    let bookcontent = <Spinner/>;

    //present book list
    if (books) {
        bookcontent = (
            <div className="book">
                    {books.map(book => (
                        <Book_ book={book} key={book.id}/>
                    ))}
            </div>
        )
    }


    //present user information
    if (user) {
        content = (

            <div className="game">
                <ul className="game user-list">
                    <br/>
                    <div>
                        <div className="player container">
                            <div className="player name">Email:</div>
                            <div className="player content">{user.email}</div>
                        </div>
                        <div className="player container">
                            <div className="player name">Username:</div>
                            <div className="player content">{user.username}</div>
                        </div>
                        <div className="player container">
                            <div className="player name">Address:</div>
                            <div className="player content">{user.address}</div>
                        </div>
                    </div>
                </ul>

            </div>
        );
    }


    return (
        <div>
            <Header height="100"/>
            <div className={`part-container`}>
                <div className={`left`}>
                    {content}
                    <SmallButton
                        width="80%"
                        onClick={() => goToEdit()}
                    >
                        Edit Profile
                    </SmallButton>
                    <br/>
                    <br/>

                    <SmallButton
                        width="80%"
                        onClick={() => goToUpload()}
                    >
                        Upload Books
                    </SmallButton>
                    <br/>
                    <br/>

                    <SmallButton
                        width="80%"
                        onClick={() => backToGame()}
                    >
                        Back
                    </SmallButton>
                    <br/>
                    <br/>
                </div>
                <div className={`right`}>
                    <div className="title">
                        Books For Sale
                    </div>
                        {bookcontent}
                        <br/>
                        <br/>

                </div>
            </div>
        </div>
    );
}


export default Profile;
