import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/User";
import Cart from "../../models/Cart";

const Book_ = ({book}) => {
    const history = useHistory();
    const handleClick = () => {
        let path={
            pathname:`/book/${book.id}`,
        }
        history.push(path);
    }
    return (<div className="book container" onClick={handleClick}>
        <div>
            <div className="book name"> {book.name}</div>
            <div className="book price">Price: {book.price}</div>
        </div>
    </div>
);
}
Book_.propTypes = {
    book: PropTypes.object
};

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Checkout Page</h1>
    </div>
);
const Checkout = () => {
    const history = useHistory();
    const [user, setUser] = useState(new User());
    const [cart, setCart] = useState(new Cart());
    const {id} = useParams();
    const [books_, setBooks_] = useState([]);

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

        async function fetchBook () {
            let user_id = id;
            const response = await api.get('/cart/books/' + user_id);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned books and update the state.
            setBooks_(response.data);
        };
        fetchData().catch((err) =>{
            console.error(err)
        });
        fetchCart().catch((err) =>{
            console.error(err)
        });
        fetchBook().catch((err) =>{
            console.error(err)
        });
    }, []);

    const backToCart = async () => {
        history.push('/cartpage/' + id);
    }

    const generateOrder = async () => {
        let userId = id;
        try {
            await api.post('/cart/order/'+userId);
        } catch (error) {
            alert(`Something went wrong during the order generation: \n${handleError(error)}`);
        }
    }
    const check_out = async () => {
        try {
            await generateOrder();
            const response = await api.put('/cart/checkout/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCart(response.data);
            console.log(response);
            alert('Checkout Successfully!');
            let buyerid = id;
            for (let book of books_) {
                let bookId = book.id;
                const requestBody = JSON.stringify(buyerid);
                await api.put('/books/' + bookId, requestBody);
            }
            history.push('/browser');
        }
        catch(error){
            console.log(error);
            alert("Something went wrong while checking out! See the console for details.");
        }
    }

    let content = <Spinner/>;
    let bookcontent = <Spinner/>;

    //present book list
    if (books_) {
        bookcontent = (
            <div className="book">
                {books_.map(book => (
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
                            <div className="player name">Address:</div>
                            <div className="player content">{user.address}</div>
                        </div>
                        <div className="player container">
                            <div className="player name">Price:</div>
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