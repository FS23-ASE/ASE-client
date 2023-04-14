import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Cartpage.scss";
import User from "../../models/User";
import Book from "../../models/Book";
import Cart from "../../models/Cart";


const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Cart</h1>

    </div>
);


const Cartpage =() => {

    const history = useHistory();

    const [cart, setCart] = useState(new Cart());
    const {id} = useParams();

    //back to main page
    const backToGame = async () => {
        history.push('/game');
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
                console.error(`You have not uploaded any book.`);
                console.error("Details:", error);
                alert("You have not uploaded any book.");
            }
        }

        fetchCart();
    }, []);

    let cartcontent = <Spinner/>;

    if(cart){
        cartcontent=(
            <ul>
                {cart.books.map(book => (
                          <li key={book.id}>
                            <div>
                              <img src={book.image} alt={book.title} />
                            </div>
                            <div>
                              <h3>{book.title}</h3>
                              <p>by {book.author}</p>
                            </div>
                          </li>
                        ))}
            </ul>
        )
    }

    return(
          <div>
            <Header height="100"/>
            <h1 className="headertitle title">Cart</h1>
            <div className="cart">
                <h2>My Cart</h2>
                <h3>Total Price:{cart.prices}</h3>
                {cartcontent}
            </div>
          </div>

    );

}

export default Cartpage;
