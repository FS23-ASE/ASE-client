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
import {Chat} from "../ui/Chat";

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
                const buyerId = id;
                const response = await api.get('/order/buyer/' + buyerId);
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

    const chatwithseller = async (seller_id) => {
        /* to be done */
    }

    const manageOrder = async (o, i) => {
        const id = o.id;
        if(i == 1){
            try {
                const status = 'RECEIVED';
                const requestBody = JSON.stringify(status);
                await api.put('/order/' + id, requestBody);
            } catch (error) {
                alert(`Something went wrong during the modification of order: \n${handleError(error)}`);
            }
            for(let j = 0; j < orders.length; j++){
                if(orders[j].id == o.id){
                    orders[j].status = "RECEIVED";
                }
            }
        }else if(i == 2){
            try {
                await api.delete('/order/' + id);
            }catch (e) {
                alert(`Something went wrong during the cancellation: \n${handleError(e)}`);
            }
            for(let j = 0; j < orders.length; j++){
                if(orders[j].id == o.id){
                    orders.splice(j, 1);
                }
            }
        }
    }

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
        for (let id of book_list) {
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
                <div className="book name"> Seller: {order.sellerId}</div>
                <div className="book name"> Amount: {order.amount}</div>
                <div className="book name"> Status: {order.status}</div>
                <div>
                    {viewBooks(order.books)}
                </div>
                <div className="book seller">
                    Chat with Seller:
                    {'\u00A0u00A0'}
                    <SmallButton
                        width="50%"
                        onClick={() => chatwithseller(order.sellerId)}>
                        Chat
                    </SmallButton>
                    <br/>
                </div>
                <div className="book received">
                    <SmallButton
                        width="50%"
                        onClick={() => manageOrder(order, 1)}>
                        Receive
                    </SmallButton>
                    <br/>
                </div>
                <div className="book cancel">
                    <SmallButton
                        width="50%"
                        onClick={() => manageOrder(order, 2)}>
                        Cancel
                    </SmallButton>
                    <br/>
                </div>
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