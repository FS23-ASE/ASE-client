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
    const [books, setBooks] = useState([]);

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
            setBooks(response.data);

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
        fetchData();
        fetchCart();
        fetchBook();

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
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        date = date+' '+time;
        var userId = id;
        let book_list_ = [];
        for(let book of books){
            book_list_.push({Id: book.id, sellerid: book.seller_id, Price: book.price});
        }
        let c =[];
        let d = {};
        book_list_.forEach(element => {
            if (!d[element.sellerid]) {
                c.push({
                    seller: element.sellerid,
                    list: [element]
                });
                d[element.sellerid] = element;
            } else {
                c.forEach(ele => {
                    if (ele.seller == element.sellerid) {
                        ele.list.push(element);
                    }
                });
            }
        });
        for (const c1 of c) {
            let amount = 0.0;
            const buyerId = userId;
            const sellerId = c1.seller;
            var book_list = [];
            c1.list.forEach(c2 => {
                amount += c2.Price;
                book_list.push(c2.Id);})
            try{
                const requestBody = JSON.stringify({buyerId, amount, sellerId, book_list, date});
                await api.post('/orders', requestBody);
            }catch (error) {
                alert(`Something went wrong during the order generation: \n${handleError(error)}`);
            }
        }
    }
    const check_out = async () => {
        try {
            const response = await api.put('/cart/checkout/' + id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCart(response.data);
            console.log(response);
            alert('Checkout Successfully!');
            var buyerid = id;
            for (let book of books) {
                var bookId = book.id;
                const requestBody = JSON.stringify({buyerid});
                await api.put('/books/' + bookId, requestBody);
            }
            await generateOrder();
            history.push('/cartpage/' + id);
        }
        catch(error){
            console.log(error);
            alert("Something went wrong while checking out! See the console for details.");
        }
    }

    let content = <Spinner/>;
    let bookcontent = <Spinner/>;

    //present book list
    if (books) {
        bookcontent = (
            <div className="book">
                {books.map(book => (
                    <Book_ book={book} key={book.id}/>
                ))}
            </div>
        )
    }


    //present user information
    if (user) {
        content = (
            <div className="main">
                <ul className="main user-list">
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
                            <div className="price">Price:</div>
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