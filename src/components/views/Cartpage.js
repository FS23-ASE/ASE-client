import React, {useEffect, useState} from 'react';
import {api} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Cartpage.scss";
import Cart from "../../models/Cart";

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Cart</h1>
    </div>
);
const Book_ = ({book}) => {
    const history = useHistory();
    const handleClick = () => {
        let path = {
            pathname: `/book/${book.id}`,
        }
        history.push(path);
    }
    return (
        <div className="book container" onClick={handleClick}>
            <div>
                <div className="book name"> {book.name}</div>
                <div className="book author">Author: {book.author}</div>
                <div className="book publisher">Publisher: {book.publisher}</div>
                <div className="book status">Book Status: {book.status.toString()}</div>
            </div>
        </div>
    );
}

Book_.propTypes = {
    book: PropTypes.object
};

const Cartpage = () => {

    const history = useHistory();

    const [cart, setCart] = useState(new Cart());
    const [books, setBooks] = useState(null);
    const {id} = useParams();

    //back to main page
    const backToMain = () => {
        localStorage.setItem('id', id);
        history.push('/browser');
    }
    const gotocheckout = () => {
        history.push(`/checkout/` + id)
    }

    useEffect(() => {
        //Fetch cart's information from server side
        async function fetchCart() {
            try {
                let user_id = id;
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
                let user_id = id;
                const response = await api.get('/cart/books/' + user_id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned books and update the state.
                setBooks(response.data);
                console.log(response);
            } catch (error) {
                console.error(`You have not added any book.`);
                console.error("Details:", error);
                alert("You have not added any book.");
            }
        }

        fetchBook().catch((err) =>{
            console.error(err)
        });
        fetchCart().catch((err) =>{
            console.error(err)
        });
    }, []);

    let bookcontent = <Spinner/>;

    if (books) {
        bookcontent = (
            <div className="book">
                {books.map(book => (
                    <Book_ book={book} key={book.id}/>
                ))}
            </div>
        )
    }

    return (
        <div style={{"margin-left":"30vw","margin-right":"30vw"}}>
            <Header height="250"/>

            {bookcontent}
            <h2 style={{"margin-left":"1vw"}}>Total Price:{cart.prices} CHF</h2>
            <br/>
            <br/>
            <SmallButton
                width="100%"
                onClick={() => gotocheckout()}
            >
                Go to Checkout
            </SmallButton>
            <br/>
            <br/>
            <SmallButton
                width="100%"
                onClick={() => backToMain()}
            >
                Back
            </SmallButton>
        </div>

    );

}

export default Cartpage;
