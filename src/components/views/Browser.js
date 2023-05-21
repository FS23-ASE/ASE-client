import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {SmallButton} from 'components/ui/SmallButton';
import {RightButton} from 'components/ui/RightButton';

import {Link, useHistory} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/Browser.scss";
import 'styles/views/Login.scss';

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">ASE BookMarket</h1>
    </div>
);

const FormField = props => {
    return (
        <div className="search field">
            <label className="search label">
                {props.label}
            </label>
            <input
                className="search input"
                placeholder="Search for.."
                value={props.value}
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

    const [books, setBooks] = useState([]);

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [a, setA] = useState('');
    const filter_items = [...new Set(books.map((book) => book.category))];

    useEffect(() => {
        async function fetchBooks() {
            try{
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
            catch(error){
                console.error(`Something went wrong while updating the description: \n${handleError(error)}`);
                console.log(error);
            alert("Something went wrong when fetching books!")}
        }

        fetchBooks().catch((err) =>{
            console.error(err)
        });
    },[]);

    const logout = async () => {
        try {
            history.push('/login');}
        catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');

    }

    const SearchBook = (bs) => {
        return bs.filter(
            (book) =>
                book.category?.includes(filter) &&
                book.name?.toLowerCase().includes(query)
        );
    }

    const addCart = async (addedbook) => {
        try {

            let bookId = addedbook.id;
            let userId = localStorage.getItem('id');
            const requestBody = JSON.stringify({userId, bookId});
            await api.post('/cart/' + userId + '/' + bookId, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Add Successfully');
        } catch (error) {
            console.log(error);
            alert(`Something went wrong when adding to the cart: \n${handleError(error)}`);
        }
    }
    const handleClick = (id) => {
        let path={
            pathname:`/book/${id}`,
        }
        history.push(path);
    }

    return(
        <div>
        <Header height="250"/>
        <div className="mainpage container">
                <div className="search select" style={{ display: "inline-block" }}>
                    <br/>
                    <select
                        onChange={(ft) => setFilter(ft.target.value)}
                        className="book-select"
                        aria-label="Filter Books by Category"

                    >
                        {filter_items.map((item) => (
                            <option key={item} value={item}>
                                Filter by {item}
                            </option>
                        ))}
                    </select>
                </div>
                <label className="search form">
                    <input
                        style={{
                            'height': '50px',
                            'padding-left': '15px',
                            'width' :'13vw',
                            'margin-left': '3vw',
                            'border':'1px solid #D36B00',
                            'border-radius': '0.75em',
                            'margin-bottom': '20px',
                            'background': 'transparentize(#f1efdc, 1)',
                            'color': '#D36B00'
                        }}
                        type="search"
                        onChange={(bs) => setA(bs.target.value)}/>
                </label>
                    <SmallButton
                        display="inline-block"
                        width="10%"
                        onClick={() => setQuery(a)}>
                        Search
                    </SmallButton>
                    <Link className="cart-link" to={`/cartpage/${localStorage.getItem('id')}`}>
                        <RightButton
                            display="inline-block"
                            disabled={localStorage.getItem('id')==null}
                            width="10%">
                            Cart
                        </RightButton>
                    </Link>
            <Link className="linkStyle" to={`/profile/${localStorage.getItem('id')}`}>
                <SmallButton
                    width="10%"
                    display="inline-block"
                    disabled={localStorage.getItem('id')==null}
                >
                    profile
                </SmallButton>
            </Link>
            {localStorage.getItem('id') !=null ? (
                <SmallButton width="10%" onClick={() => logout()}>
                    Logout
                </SmallButton>
            ) : (
                <Link className="linkStyle" to={`/login`}>
                <SmallButton width="10%" >
                    Login
                </SmallButton>
                </Link>
            )}

            <div className="book-grid" >
                {SearchBook(books)
                    .map((book) =>(
                        book.status &&
                            <div className="book" key={book.id} style={{"display":"inline-block"}}>
                                <div className="book container" >
                                    <div onClick={()=>handleClick(book.id)}>
                                        {" " && (
                                            <img
                                                src={book.image}
                                                alt="Book image"
                                                style={{ width: "200px", height: "auto" }}
                                            />
                                        )}
                                        <div className="book name"> {book.name}</div>
                                        <div className="book author">Author: {book.author}</div>
                                        <div className="book publisher">Publisher: {book.publisher}</div>
                                        <br/>
                                    </div>
                                    <SmallButton
                                        width="60%"
                                        disabled={localStorage.getItem('id')==null}
                                        onClick={()=>addCart(book)}>+ Cart
                                    </SmallButton>
                                </div>

                            </div>

                    ))}
            </div>
            <br/>
            <br/>
            <br/>
            <br/>

        </div>
            </div>
    )
}
export default Browser;