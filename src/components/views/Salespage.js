import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {MacScrollbar} from "mac-scrollbar";
import {SmallButton} from 'components/ui/SmallButton';
import {useHistory, useParams} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import {Button} from "../ui/Button";


const Salespage = () => {
    const history = useHistory();
    const {id} = useParams();
    const [orders, setOrders] = useState(null);
    const [books, setBooks] = useState(null);
    const [flag, setFlag] = useState(true);
    const Header = props => (
        <div className="headertitle container" style={{height: props.height}}>
            <h1 className="headertitle title">Personal Salespage</h1>
            <h2 className="headertitle subtitle">Sales History:</h2>
        </div>
    );
    const contactwithbuyer = async (buyer_id, orderId) => {
        const sender = id;
        const accepter = buyer_id;
        history.push('/contactform/' + sender + '/' +accepter + '/' + orderId);
    }

    const manageOrder = async (o, i) => {
        const id = o.id;
        if (i == 1) {
            try {
                await api.put(`/order/shipped/${id}`);
            } catch (error) {
                console.error(`Something went wrong during the modification of order.`);
                console.error("Details:", error);
                alert(`Something went wrong during the modification of order: \n${handleError(error)}`);
            }

        } else if (i == 2) {
            try {
                await api.put('/order/cancel/' + id);
            } catch (e) {
                alert(`Something went wrong during the cancellation: \n${handleError(e)}`);
            }
        }
    }

    const Book_ = ({book}) => (
        <div className="book container">
            <div>
                <div className="book name"> {book.name}</div>
                <div className="book price">Price: {book.price}</div>
            </div>
        </div>
    );
    Book_.propTypes = {
        book: PropTypes.object
    };

    const Order_ = ({order}) => {
        useEffect(() => {
            const fetchBooks = async () => {
                if(flag==true) {
                    try {
                        const response = await api.get('/order/books/' + order.id);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        setBooks(response.data);
                        order.book=response.data;
                        console.log(response);
                        setFlag(false);
                    } catch (error) {
                        console.error(`Something went wrong when getting books.`);
                        console.error("Details:", error);
                        alert("Something went wrong when getting books.");
                    }
                }
            };

            fetchBooks().catch((err) =>{
                console.error(err)
            });
        },[]);

        if (books) {
            return (
                <div className="book container">
                    <div>
                        <div className="book name"> Total Order Amount: {order.amount}</div>
                        <div className="book name"> Time: {order.date}</div>
                        <div className="book name"> Order Status: {order.status}</div>
                        <div className="book">
                            {order.books.map(book => (
                                <Book_ book={book} key={book.id} />
                            ))}
                        </div>
                        <div className="book seller">
                            <Button
                                width="100%"
                                onClick={() => contactwithbuyer(order.buyerId, order.id)}>
                                Contact Seller
                            </Button>
                            <br/>
                        </div>
                        <br/>
                        <div className="book received">
                            <Button
                                width="100%"
                                onClick={() => manageOrder(order, 1)}>
                                Shipped
                            </Button>
                            <br/>
                        </div>
                        <br/>
                        <div className="book cancel">
                            <Button
                                width="100%"
                                onClick={() => manageOrder(order, 2)}>
                                Cancel Order
                            </Button>
                            <br/>
                        </div>
                    </div>
                </div>
            );
        }
    };
    Order_.propTypes = {
        order: PropTypes.object
    };

    function OrderList(props) {
        const orders = props.orders;
        if (orders) {
            const orderItems = orders.map((order) =>
                <li key={order.id}>
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

    async function fetchOrders() {
        try {
            const response = await api.get('/order/seller/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOrders(response.data);
            console.log(response);
        } catch (error) {
            console.error(`Something went wrong while fetching orders: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching orders! See the console for details.");
        }
    };
    useEffect(() => {
        fetchOrders().catch((err) =>{
            console.error(err)
        });
    }, []);

    const backtoOverview = () => {
        history.push(`/profile/` + id);
    }

    return (
        <div>
            <Header height="250"/>
            <SmallButton
                width="10%"
                onClick={() => backtoOverview()}
            >
                Back
            </SmallButton>
            <div className={`mainpage container`}>
                <MacScrollbar>
                    <div>
                        <OrderList orders = {orders}/>
                    </div>
                </MacScrollbar>
            </div>

            <br/>

        </div>
    )
};

export default Salespage;