import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {SmallButton} from 'components/ui/SmallButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import User from "../../models/Contact";
import {MacScrollbar} from "mac-scrollbar";


const MessageBox = () => {
    const history = useHistory();
    const {id} = useParams();
    const [contacts, setContacts] = useState([]);
    const Contact_ = ({ contact }) => {
        const history = useHistory();
        const reply = (accepter, sender, orderId) => {
            history.push('/contactform/' + {sender, accepter, orderId});
        }

        return (
            <div className="book container">
                <div>
                    {/*<div className="book name"> {contact.id}</div>*/}
                    <div className="book author">Sender: {contact.sender}</div>
                    <div className="book publisher">Content: {contact.msg}</div>
                    <div className="book status">
                        <SmallButton
                            width="50%"
                            onClick={() => reply(contact.sender, contact.accepter, contact.orderId)}>
                            Reply
                        </SmallButton>
                    </div>
                </div>
            </div>
        );
    };


    const Header = props => (
        <div className="headertitle container" style={{height: props.height}}>
            <h1 className="headertitle title">Message Box</h1>
        </div>
    );

    Contact_.propTypes = {
        contact: PropTypes.object
    };

    useEffect(() => {
        async function fetchContacts() {
            try {
                var accepter = id;
                const response = await api.get('/contactform/accepter/' + accepter);
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (response.data) {
                    setContacts(response.data);
                } else {
                    setContacts([]);
                }
            }
            catch(error){
                console.error(`Something went wrong while fetching messages: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching messages! See the console for details.");
            }
        };
        fetchContacts().catch((err) =>{
            console.error(err)
        });
    })

    const backToProfile = () =>{
        history.push('/profile/' + id);
    }

    let contactscontent = <Spinner/>;

    if(contacts) {
        if (contacts == []) {
            contactscontent = (
                <div>
                    <h2>You don't have any message yet</h2>
                </div>
            )
        } else {
            contactscontent = (
                <div className="book">
                    {contacts.map(contact => (
                        <Contact_ contact={contact} key={contact.id}/>
                    ))}
                </div>
            )
        }
    }

    return (
        <div>
            <Header height="250"/>
            <div className={`part-container`}>
                <div className={`left`}>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <SmallButton
                        width="80%"
                        onClick={() => backToProfile()}
                    >
                        Back
                    </SmallButton>
                </div>
                <div className={`right`}>
                    <div className="title">
                        Messages List
                    </div>
                    <MacScrollbar>
                        <div>
                            {contactscontent}
                        </div>
                    </MacScrollbar>
                    <br/>
                    <br/>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;