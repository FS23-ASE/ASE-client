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


const Cartpage =() => {

    const history = useHistory();

    const [cart, setCart] = useState(new Cart());
    const {id} = useParams();

    //back to main page
    const backToGame = async () => {
        history.push('/game');
    }

    const backToProfile = async () => {
            history.push(`/Profile/` + id);
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

        fetchCart();
    }, []);

    let bookcontent = <Spinner/>;

    if(cart.books){
        bookcontent=(
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
            <h1>Cart information</h1>
            <h2>CartId:{cart.id}</h2>
            <h2>Total Price:{cart.prices}</h2>



            <SmallButton
                width="80%"
                onClick={() => backToProfile()}
            >
                Profile
            </SmallButton>

        </div>

    );

}

export default Cartpage;
