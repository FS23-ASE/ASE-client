import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/User";
import Book from "../../models/Book";

//Present user information
const Player = ({user}, {online_status = user.logged_in.toString()}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
        <div className="player id">ONLINE: {user.id}</div>
        <div className="player email">Email: {user.email}</div>
        <div className="player address">Birthday: {user.address}</div>
    </div>
);
//Present book information
const Book_ = ({book}) => (
    <div className="book container">
        <div className="book name">{book.name}</div>
        <div className="book id">ONLINE: {book.id}</div>
        <div className="book author">Email: {book.author}</div>
        <div className="book publisher">Birthday: {book.publisher}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};
Book_.propTypes = {
    book: PropTypes.object
};

const Profile = () => {

    const history = useHistory();

    const [user, setUser] = useState(new User());
    const [books, setBooks] = useState(null)
    const {id} = useParams();

    //back to main page
    const backToGame = async () => {
        history.push('/game');}

    //direct to edit page
    const goToEdit = async () => {
        history.push(`/edit/`+id);
    }


    useEffect(() => {

        //Fetch the user's information from server side
        async function fetchData() {
            try {
                const response = await api.get('/users/'+id);

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
        async function fetchBook() {
            try {
                var seller_id = id;
                const response = await api.get('/books/seller/'+seller_id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned books and update the state.
                setBooks(response.data);

                console.log(response);
            } catch (error) {
                console.error(`You have not uploaded any book.`);
                console.error("Details:", error);
                alert("You have not uploaded any book.");
            }
        }
        fetchData();
        fetchBook()
    }, []);

    let content = <Spinner/>;
    let bookcontent = <Spinner/>;

    //present book list
    if(books) {
        bookcontent = (
            <div className="book">
                <ul className="book-list">
                    {books.map(book => (
                        <Book_ book={book} key={book.id}/>
                    ))}
                </ul>
            </div>
        )
    }


    //present user information
    if (user) {
        content = (
            <div className="game">
                <ul className="game user-list">
                        <Player user={user} key={user.id}/>
                </ul>
                <br/>
                <br/>
                {bookcontent}
                <br/>
                <br/>
                <Button
                    width="100%"
                    onClick={() => goToEdit()}
                >
                    Edit
                </Button>
                <Button
                    width="100%"
                    onClick={() => backToGame()}
                >
                    Back
                </Button>
            </div>
        );
    }


    return (
        <BaseContainer className="game container">
            <p className="game paragraph">
                Visiting User Profile:
            </p>
            {content}
        </BaseContainer>
    );
}



export default Profile;
