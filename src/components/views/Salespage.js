import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {MacScrollbar} from "mac-scrollbar";
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import Contact from "../../models/Contact";

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Personal Salespage</h1>
        <h2 className="headertitle subtitle">Sales History:</h2>
    </div>
);
const Salespage = () => {
    const history = useHistory();
    const {id} = useParams();
    const [order, setOrder] = useState();
    const [orders, setOrders] = useState(null);
    const [book, setBook] = useState(new Book_());
    const [books, setBooks] = useState(null);

    async function fetchOrders() {
        try {
            const sellerId = id;
            const response = await api.get('/order/seller/' + sellerId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Get returned orders and update the state.
            if (response.data) {
                const ordersPromise = response.data.map(order =>{
                    return {...order}
                });
                const ordersPromise_ = await Promise.all(ordersPromise);
                setOrders(ordersPromise_);
            } else {
                setOrders([]);
            }
            console.log(response);
            console.log(Array.isArray(orders));
        } catch (error) {
            console.error(`Something went wrong while fetching orders: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching sales! See the console for details.");
        }
    };
    useEffect(() => {

        //Fetch the user's information from server side
        fetchOrders();
    }, []);

    const contactwithbuyer = async (buyer_id, orderId) => {
        const sender = id;
        const accepter = buyer_id;
        history.push('/contactform/' + {sender, accepter, orderId});
    }

    const manageOrder = async (o, i) => {
        const id = o.id;
        if(i == 1){
            try {
                const status = 'SHIPPED';
                const requestBody = JSON.stringify(status);
                await api.put('/orders/' + id, requestBody);
            } catch (error) {
                alert(`Something went wrong during the modification of order: \n${handleError(error)}`);
            }
            for(let j = 0; j < orders.length; j++){
                if(orders[j].id == o.id){
                    orders[j].status = "SHIPPED";
                }
            }
        }else if(i == 2){
            try {
                await api.delete('/orders/' + id);
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
                <div className="book name"> Buyer ID: {order.buyerId}</div>
                <div className="book name"> Amount: {order.amount}</div>
                <div className="book name"> Status: {order.status}</div>
                <div>
                    {viewBooks(order.books)}
                </div>
                <div className="book seller">
                    Chat with Buyer:
                    {'\u00A0u00A0'}
                    <SmallButton
                        width="50%"
                        onClick={() => contactwithbuyer(order.buyerId, order.id)}>
                        Contact
                    </SmallButton>
                    <br/>
                </div>
                <div className="book shipped">
                    <SmallButton
                        width="50%"
                        onClick={() => manageOrder(order, 1)}>
                        Ship
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

    function OrderList(props) {
        const orders = props.orders;
        if (orders) {
            const orderItems = orders.map((order) =>
                <li>
                    <Order_ order={order} key={order.id}/>
                </li>
            );
            return (
                <ul>
                    <div className="book">
                        {orderItems}
                    </div>
                </ul>
            );
        }
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
                            <OrderList orders = {orders}/>
                        </div>
                    </MacScrollbar>
                </div>
            </div>
        </div>
    );
};

export default Salespage;