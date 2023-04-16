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
import 'styles/views/Login.scss';

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="Search for.."
                value={props.value}
                width="60%"
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};
const Browser = () => {
    const history = useHistory();

    const [user, setUser] = useState(new User());
    const [books, setBooks] = useState([]);
    const {id} = useParams();
    const [cart, setCart] = useState(new Cart());
    //cart.userId = id;

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [a, setA] = useState('');
    const search_parameters = Object.keys(Object.assign({}, ...books));
    const filter_items = [...new Set(books.map((book) => book.category))];
    const [paginate, setPaginate] = useState(8);

    useEffect(() => {
        async function fetchBooks() {
                const response = await api.get('/books');

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned books and update the state.
                if (response.data) {
                    const booksWithImagePromises = response.data.map(async book => {
                        const response = await api.get(`/books/${book.id}/image`, { responseType: 'arraybuffer' });
                        const blob = new Blob([response.data], { type: response.headers['content-type'] });
                        const url = URL.createObjectURL(blob);
                        return { ...book, image: url };
                    });
                    const booksWithImage = await Promise.all(booksWithImagePromises);
                    setBooks(booksWithImage);
                } else {
                    setBooks([]);
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
                book.category?.includes(filter) &&
                book.name?.toLowerCase().includes(query)
        );
    }

    const addCart = async (addedbook) => {

            let bookId = addedbook.id;
            let userId = id;
            const requestBody = JSON.stringify({userId, bookId});
            await api.post('/cart/' + userId + '/' + bookId, requestBody);
            alert('Add Successfully');

    }

    const load_more = () => {
        setPaginate((preValue) => preValue + 8);
    }

    return(
        <div className="mainpage-wrapper">
            <div className="mainpage-search-wrapper">
                <label className="search-form">
                    <FormField
                        type="search"
                        onChange={e => setA(e.target.value)}/>
                    <span className="sr-only">Search books here</span>
                    <Button
                        width="50%"
                        onClick={setQuery(a)}>
                        Search
                    </Button>
                </label>
            </div>
            <div className="cart">
                <Link className="cart-link" to={`/cartpage/${id}`}>
                    <Button
                        width="100%">
                        Cart
                    </Button>
                </Link>
            </div>
            <div className="select">
                <select
                    onChange={(ft) => setFilter(ft.target.value)}
                    className="book-select"
                    aria-label="Filter Books by Category">
                    <option value="">Filter by Category</option>
                    {filter_items.map((item) => (
                        <option value={item}>Filter by {item}</option>
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
                                    {book.image && <img src={book.image} alt="Book image" style={{ width: '200px', height: 'auto' }} />}
                                </div>
                                <div className="book-content">
                                    <h2 className="book-name">Book Name: {book.name}</h2>
                                    <h2 className="book-category">Category: {book.category}</h2>
                                    <h2 className="book-sellerid">Seller: {book.sellerid}</h2>
                                    <h2 className="book-price">Seller: {book.price}</h2>
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