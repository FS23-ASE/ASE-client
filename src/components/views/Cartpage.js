import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Cartpage.scss";
import User from "../../models/User";
import Book from "../../models/Book";
import Cart from "../../models/Cart";

const Book_ = ({book}) => (
    <div className="book container">
        <div>
            <div className="book name"> {book.name}</div>
            <div className="book author">Author: {book.author}</div>
            <div className="book publisher">Publisher: {book.publisher}</div>
            <div className="book status">Book Status: {book.status.toString()}</div>
        </div>
    </div>
);

Book_.propTypes = {
    book: PropTypes.object
};

const Cartpage =() => {

    const history = useHistory();

    const [cart, setCart] = useState(new Cart());
    const [books, setBooks] = useState(null);
    const {id} = useParams();

    //back to main page
    const backToGame = () => {
        localStorage.setItem('id', id);
        history.push('/game');
    }

    const backToProfile = () => {
        history.push(`/profile/` + id);
    }

    const gotocheckout = () => {
        history.push(`/checkout/` + id)
    }

    useEffect(() => {
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


        async function fetchBook() {
            try {
                var user_id = id;
                const response = await api.get('/cart/books/' + user_id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned books and update the state.
                setBooks(response.data);
                //books.map(async book => (book.image = await api.get('/books/' + book.id+'/image')));
                console.log(response);
            } catch (error) {
                console.error(`You have not added any book.`);
                console.error("Details:", error);
                alert("You have not added any book.");
            }
        }

        fetchBook();
        fetchCart();
    }, []);

    let bookcontent = <Spinner/>;

    if(books){
        bookcontent = (
                    <div className="book">
                            {books.map(book => (
                                <Book_ book={book} key={book.id}/>
                            ))}
                    </div>
                )
    }

    return(
          <div>
            <h1>Cart information</h1>
            <h2>CartId:{cart.id}</h2>
            <h2>Total Price:{cart.prices}</h2>
            {bookcontent}
            <br/>
            <br/>
          <SmallButton
              width="80%"
              onClick={() => gotocheckout()}
          >
              Go to Checkout
          </SmallButton>
          <br/>
            <SmallButton
                width="80%"
                onClick={() => backToProfile()}
            >
                Profile
            </SmallButton>
          <br/>
          <SmallButton
              width="80%"
              onClick={() => backToGame()}
          >
              Back to Main Page
          </SmallButton>
        </div>

    );

}

export default Cartpage;
