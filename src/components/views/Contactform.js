import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import User from 'models/User';
import 'styles/views/Contactform.scss';

const Header = props => (
    <div className="headertitle container" style={{height: props.height}}>
        <h1 className="headertitle title">Contact Form</h1>
    </div>
);

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login Input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Contactform = () => {
    const history = useHistory();
    const [sendername, setSendername] = useState('');
    const [acceptername, setAcceptername] = useState('');
    const {sender, accepter, orderId} = useParams();
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState('');

    const doSubmit = async () => {
        try {
            const requestBody = JSON.stringify({sender, accepter, orderId, msg});
            const response = await api.post('/contactform', requestBody);
            setForm(response.data);
            alert('Contact Form ' + form.id + 'Submit Successfully!');

            // Sending contact form successfully worked --> navigate to last page
            history.back();
        } catch (error) {
            alert(`Something went wrong during sending contact form: \n${handleError(error)}`);
        }
    };

    const goBack = () => {
        history.back();
    };

    useEffect(() => {
        async function fetchSender() {
            try {
                const id = sender;
                const response = await api.get('/users/' + id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned user and update the state.
                const user_ = new User(response.data);
                setSendername(user_.username);

                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the sender: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the sender! See the console for details.");
            }
        };

        async function fetchAccepter() {
            try {
                const id = accepter;
                const response = await api.get('/users/' + id);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned user and update the state.
                const user_ = new User(response.data);
                setAcceptername(user_.username);

                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the accepter: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the accepter! See the console for details.");
            }
        };
        fetchSender();
        fetchAccepter();
    })

    return (
        <BaseContainer>
            <div className="login container">
                <Header height="250"/>
                <br/>
                <br/>
                <br/>
                <div className="login form">
                    <div className="sender name">
                        Sender: {sendername}
                    </div>
                    <br/>
                    <br/>
                    <div className="accepter name">
                        Accepter: {acceptername}
                    </div>
                    <br/>
                    <br/>
                    <div className="order Id">
                        Order: {orderId}
                    </div>
                    <br/>
                    <br/>
                    <FormField
                        label="Email"
                        value={msg}
                        onChange={n => setMsg(n)}
                    />
                    <div className="login registration-button-container">
                        <Button
                            disabled={!msg}
                            width="100%"
                            onClick={() => doSubmit()}
                        >
                            Submit
                        </Button>
                    </div>
                    <div className="login button-container">
                        <Button
                            width="100%"
                            onClick={() => goBack()}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default Contactform;