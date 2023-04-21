import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {MacScrollbar} from "mac-scrollbar";
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/User";
import Book from "../../models/Book";
import Order from "../../models/Order";

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Personal Orderpage</h1>
        <h2 className="headertitle subtitle">Order History:</h2>
    </div>
);
const Orderpage = () => {
    const history = useHistory();
    const {id} = useParams();
    const [order, setOrder] = useState();
    const [orders, setOrders] = useState([]);
    const [book, setBook] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {

        //Fetch the user's information from server side
        async function fetchOrders() {
            try {
                var userId = id;
                const response = await api.get('/orders/' + userId);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Get returned orders and update the state.
                setOrders(response.data);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching orders: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching orders! See the console for details.");
            }
        };
        fetchOrders();
    }, []);

    const Book_ = ({book}) => (
        <div className="book container">
            <div>
                {/*{book.image && <img src={book.image} alt="Book image" style={{ width: '100px', height: 'auto' }} />}*/}
                <div className="book name"> {book.name}</div>
                <div className="book price">Price: {book.price}</div>
            </div>
        </div>
    );
    Book_.propTypes = {
        book: PropTypes.object
    };

    let ordercontent = <Spinner/>;
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

    const backtoOverview = () => {
        history.push(`/profile/` + id);
    }

    const viewBooks = async (book_list) => {
        for (let bookId of book_list) {
            var id = bookId;
            const response = await api.get('/books/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            books.push(setBook(response.data));
        }
        return (
            {bookcontent}
        )
        setBooks([]);

    }

    const Order_ = ({order}) => (
        <div className="book container">
            <div>
                <div className="book name"> Order ID: {order.id}</div>
                <div>
                    {viewBooks(order.book_list)}
                </div>
                <div className="book publisher">Amount: {order.amount}</div>
                <div className="book status">Order Status: {order.status.toString()}</div>
            </div>
        </div>
    );
    Order_.propTypes = {
        order: PropTypes.object
    };

    if (orders) {
        ordercontent = (
            <div className="book">
                {orders.map(order => (
                    <Order_ order={order} key={order.id}/>
                ))}
            </div>
        )
    }

    return (
        <div>
            <Header height="250"/>
                <div className={`part-container`}>
                        <div className={`left`}>
                            <SmallButton
                                width="80%"
                                onClick={() => backtoOverview()}
                            >
                                Back to User Overview
                            </SmallButton>
                            <br/>
                        </div>
                        <div className={`right`}>
                            <div className="title">
                                Order Detail
                            </div>
                            <MacScrollbar>
                                <div>
                                    {ordercontent}
                                </div>
                            </MacScrollbar>
                        </div>
                </div>
        </div>
    )
}

export default Orderpage;