import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/User";
import Book from "../../models/Book";
import Cart from "../../models/Cart";

const Book_ = ({book}) => (
    <div className="book container">
        <div>
            {book.image && <img src={book.image} alt="Book image" style={{ width: '100px', height: 'auto' }} />}
            <div className="book name"> {book.name}</div>
            <div className="book price">Price: {book.price}</div>
        </div>
    </div>
);
Book_.propTypes = {
    book: PropTypes.object
};
const Checkout = () => {
    const history = useHistory();
    const [user, setUser] = useState(new User());
    const [cart, setCart] = useState(new Cart());
    const {id} = useParams();
    const [book, setBook] = useState(new Book());
    const [book_list, setBook_list] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
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
        //Fetch cart's information from server side
        async function fetchCart() {
            try {
                var user_id = id;
                const response = await api.get('/cart/' + user_id);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Get the returned cart and update the state.
                setCart(response.data);
                console.log(response);
            } catch (error) {
                console.error("Details:", error);
                alert("Some error happens when get cart");
            }
        }

        const fetchBook = async (bookid) => {
            var id = bookid;
            const response = await api.get('/books/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const [book, setBk] = useState(new Book());
            setBk(response.data);

            const response1 = await api.get(`/books/${book.id}/image`, { responseType: 'arraybuffer' });
            const blob = new Blob([response1.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);
            return { ...book, image: url };
        };
        fetchData();
        fetchCart();
        setBook_list(cart.books);
        for(let i = 0; i < book_list.length; i++){
            setBook(fetchBook(book_list[i]));
            books.push(book);
        }
    }, []);

    const backToCart = async () => {
        history.push('/cartpage/' + id);
    }

    const check_out = async () => {
        alert('Checkout Successfully!');
    }

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
                            <div className="player name">Address:</div>
                            <div className="player content">{user.address}</div>
                        </div>
                        <div className="player container">
                            <div className="price">Price:</div>
                            <div className="player content">{cart.prices}</div>
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
                        onClick={() => check_out()}
                    >
                        Checkout
                    </SmallButton>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => backToCart()}
                    >
                        Back
                    </SmallButton>
                    <br/>
                </div>
                <div className={`right`}>
                    <div className="title">
                        Order Information:
                    </div>
                    {bookcontent}
                    <br/>
                    <br/>
                </div>
            </div>
        </div>
    );
}
export default Checkout;