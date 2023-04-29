import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import Book from "../../models/Book";
import {useLocation} from "react-router";
import {Dropdown} from "rsuite";




const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Personal Homepage</h1>
    </div>
);


const BookDetail = () => {

    const history = useHistory();
    const { id } = useParams();
    const [book, setBook] = useState(null);

    //back to main page
    const goback = () => {
        history.goBack();
    }



    useEffect(() => {

        //Fetch the user's information from server side
        async function fetchData() {
            try {
                const response = await api.get('/books/' + id);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Get the returned user and update the state.
                const book = new Book(response.data);
                setBook(book);
                console.log(response);
                if (response.data) {
                        const imageresponse = await api.get(`/books/${id}/image`, {responseType: 'arraybuffer'});
                        const blob = new Blob([imageresponse.data], {type: imageresponse.headers['content-type']});
                        const url = URL.createObjectURL(blob);
                    const updatedbook={...book, image: url}
                    console.log(imageresponse);
                    setBook(updatedbook);
                    }

            } catch (error) {
                console.error(`Something went wrong while fetching the book: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the book! See the console for details.");
            }
        };

        fetchData();
    }, []);

    let content = <Spinner/>;

    if(book){
        content=(
            <div className="update form">
                <br/>
                Book Name: {book.name}
                <br/>
                Book Category: {book.category}
                <br/>
                Author: {book.author}
                <br/>
                Publisher: {book.publisher}
                <br/>
                Description: {book.description}
                <br/>
                Price(CHF): {book.price}
                <br/>
                Image:
                <br/>
                {" " && (
                    <img
                        src={book.image}
                        alt="Book image"
                        style={{ width: "200px", height: "auto" }}
                    />
                )}
                <br/>

                <br/>
                <br/>
            </div>


        )
    }




    return (
        <div>
            <Header height="100"/>
            <div className="edit-container">
                <div className="Update container">
                    {content}
                    <Button
                        width="100%"
                        onClick={() => goback()}
                    >
                        Back
                    </Button>
                    </div>
                </div>
            </div>

    );
}


export default BookDetail;