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



//Present book information
const Book_ = ({ book }) => {
    const history = useHistory();

    const handleClick = () => {
        var path={
            pathname:`/book/${book.id}`,
        }
        history.push(path);
    }

    return (
        <div className="book container" onClick={handleClick}>
            <div>
                {" " && (
                    <img
                        src={book.image}
                        alt="Book image"
                        style={{ width: "190px", height: "auto" }}
                    />
                )}
                <div className="book name"> {book.name}</div>
                <div className="book author">Author: {book.author}</div>
                <div className="book publisher">Publisher: {book.publisher}</div>
                <div className="book status">Book Status: {book.status.toString()}</div>
            </div>
        </div>
    );
};


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
    const backToMain = () => {
        history.push('/browser');
    }

    //direct to edit page
    const goToEdit = () => {
        history.push(`/edit/` + id);
    }

    const goToUpload = () => {
        history.push(`/upload/` + id);
    }

    const goToCart = () => {
        history.push(`/cartpage/` + id);
    }

    const viewSales = () => {
        history.push(`/salespage/` + id)
    }

    const viewMessages = () => {
        history.push('/messagebox/' + id)
    }

    const viewOrder = () => {
        history.push(`/orderpage/` + id);
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
                localStorage.removeItem("id");
                localStorage.removeItem("token");
                history.push('/login');
            }
        };
        const fetchBook = async () => {
            try {
                var seller_id = id;
                const response = await api.get('/books/seller/' + seller_id);
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (response.data) {
                    const booksWithImagePromises = response.data.map(async book => {
                        const response = await api.get(`/books/${book.id}/image`, {responseType: 'arraybuffer'});
                        const blob = new Blob([response.data], {type: response.headers['content-type']});
                        const url = URL.createObjectURL(blob);
                        return {...book, image: url};
                    });
                    const booksWithImage = await Promise.all(booksWithImagePromises);
                    setBooks(booksWithImage);
                } else {
                    setBooks([]);
                }
            }
            catch(error){
                console.error(`Something went wrong while fetching the book: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the book! See the console for details.");
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
            <div className="profile">
                <ul className="profile user-list">
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
            <Header height="250"/>
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
                        onClick={() => viewSales()}
                    >
                        My Sales
                    </SmallButton>
                    <br/>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => viewOrder()}
                    >
                        View Orders
                    </SmallButton>
                    <br/>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => viewMessages()}
                    >
                        View Messages
                    </SmallButton>
                    <br/>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => goToCart()}
                    >
                        Cart
                    </SmallButton>
                    <br/>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => backToMain()}
                    >
                        Back
                    </SmallButton>

                    <br/>
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
