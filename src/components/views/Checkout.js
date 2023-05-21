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
import Order from "../../models/Order";

const Book_ = ({book}) => {
    const history = useHistory();
    const handleClick = () => {
        var path={
            pathname:`/book/${book.id}`,
        }
        history.push(path);
    }
    return (<div className="book container" onClick={handleClick}>
        <div>
            {/*{book.image && <img src={book.image} alt="Book image" style={{ width: '100px', height: 'auto' }} />}*/}
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
    const [order, setOrder] = useState(new Order());
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

        async function fetchBook () {
            var user_id = id;
            const response = await api.get('/cart/books/' + user_id);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned books and update the state.
            setBooks_(response.data);

            // var id = bookid;
            // const response = await api.get('/books/' + id);
            // await new Promise(resolve => setTimeout(resolve, 1000));
            //
            // let book = new Book();
            // book = response.data;
            //
            // const response1 = await api.get(`/books/${book.id}/image`, { responseType: 'arraybuffer' });
            // const blob = new Blob([response1.data], { type: response.headers['content-type'] });
            // const url = URL.createObjectURL(blob);
            // return { ...book, image: url };
        };
        fetchData().then().catch();
        fetchCart().then().catch();
        fetchBook().then().catch();

        // setBook_list(cart.books);
        // for(let i = 0; i < book_list.length; i++){
        //     setBook(fetchBook(book_list[i]));
        //     books.push(book);
        // }
    }, []);

    const backToCart = async () => {
        history.push('/cartpage/' + id);
    }

    const generateOrder = async () => {
        /*
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        date = date + ' ' + time;
        const userId = id;
        let book_list_ = [];
        for (let book of books_) {
            book_list_.push({Id: book.id, sellerId: book.sellerId, Price: book.price});
        }
        let c = [];
        let d = {};
        for (let i = 0; i < book_list_.length; i++) {
            let element = book_list_[i];
            if (!d[element.sellerId]) {
                c.push({
                    seller: element.sellerId,
                    list: [element]
                });
                d[element.sellerId] = element;
            } else {
                for (const ele of c) {
                    if (ele.seller == element.sellerId) {
                        ele.list.push(element);
                    }
                };
            }
        };
        for (let i = 0; i < c.length; i++) {
            let c1 = c[i];
            let amount = 0.0;
            const buyerId = userId;
            const sellerId = c1.seller;
            let books = [];
            const status = 'PAID';
            for (let j = 0; j < c1.list.length; j++) {
                let c2 = c1.list[j];
                amount += c2.Price;
                books.push(c2.Id);
            }
            try {
                const requestBody = JSON.stringify({buyerId, amount, sellerId, books, date, status});
                console.log(requestBody);
                await api.post('/order', requestBody);
            } catch (error) {
                alert(`Something went wrong during the order generation: \n${handleError(error)}`);
            }
        }*/
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
            var buyerid = id;
            for (let book of books_) {
                var bookId = book.id;
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