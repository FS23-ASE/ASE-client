import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import User from "../../models/User";
import Book from "../../models/Book";
import Cart from "../../models/Cart";
import "styles/views/Browser.scss";

const Browser = () => {
    const history = useHistory();

    const [user, setUser] = useState(new User());
    const [books, setBooks] = useState([]);
    const {id} = useParams();
    const [cart, setCart] = useState(new Cart());
    //cart.userId = id;

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const search_parameters = Object.keys(Object.assign({}, ...books));
    const filter_items = [...new Set(books.map((book) => book.category))];
    const [paginate, setPaginate] = useState(8);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await api.get('/books');

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned books and update the state.
                setBooks(response.data);

                console.log(response);
            } catch (error) {
                console.error(`Something wrong while fetching books.`);
                console.error("Details:", error);
                alert("Something wrong while fetching books.");
            }
        }
        fetchBooks();
    },[]);

    const backToGame = async () => {
        localStorage.setItem('id', id)
        history.push('/game');}

    const SearchBook = (bs) => {
        return bs.filter(
            (book) =>
                book.category.includes(filter) &&
                search_parameters.some((name) =>
                    book[name].toString().toLowerCase().includes(query)
                )
        );
    }

    const addCart = async (addedbook) => {
        try {
            let bookId = addedbook.id;
            let userId = id;
            const requestBody = JSON.stringify({userId, bookId});
            await api.post('/cart/' + userId + '/' + bookId, requestBody);
            alert('Add Successfully');
        } catch (error) {
            alert(`Something went wrong during adding book: \n${handleError(error)}`);
        }
    }

    const load_more = () => {
        setPaginate((preValue) => preValue + 8);
    }

    return(
        <div className="mainpage-wrapper">
            <div className="mainpage-search-wrapper">
                <label className="search-form">
                    <input
                        type="search"
                        name="search-form"
                        id="search-form"
                        className="search-input"
                        placeholder="Search For..."
                        onInput={bs => setQuery(bs.toString)}/>
                    <span className="sr-only">Search books here</span>
                </label>
            </div>
            <div className="cart">
                <Link className="cart-link" to={`/cartpage/${id}`}>
                    <Button
                        width="50%">
                        Cart
                    </Button>
                </Link>
            </div>
            <div className="select">
                <select
                    onChange={ft => setFilter(ft.toString)}
                    className="book-select"
                    aria-label="Filter Books by Category">
                    <option value="">Filter by Category</option>
                    {filter_items.map((item) => (
                        <option value={item}>Fileter by {item}</option>
                    ))}
                </select>
                <span className="focus"></span>
            </div>
            <br/>
            <br/>
            <ul className="book-grid">
                {SearchBook(books)
                    .slice(0, paginate)
                    .map((book) =>(
                        <li key={book.id}>
                            <article className="book">
                                <div className="book-image">
                                    <img src={URL.createObjectURL(new Blob(book.image))} alt={book.name}/>
                                </div>
                                <div className="book-content">
                                    <h2 className="book-name">Book Name: {book.name}</h2>
                                    <h2 className="book-category">Category: {book.category}</h2>
                                    <h2 className="book-sellerid">Seller: {book.sellerid}</h2>
                                    <h2 className="book-price">Seller: {book.price.toString()}</h2>
                                </div>
                                <br/>
                                <br/>
                                <div className="book-purchase-button">
                                    <Button
                                        width="50%"
                                        onclick={addCart(book)}>Add to Cart</Button>
                                </div>
                            </article>
                        </li>
                    ))}
            </ul>
            <br/>
            <br/>
            <Button
                width="100%"
                onClick={load_more}>Load More...</Button>
            <br/>
            <br/>
            <Button
                width="100%"
                onClick={() => backToGame()}
            >
                Back
            </Button>
        </div>
    )
}
export default Browser;