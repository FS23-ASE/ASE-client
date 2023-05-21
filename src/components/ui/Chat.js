import React, {Component} from "react";
import {useParams} from "react-router-dom";
import cls from "classnames";
export const Chat = () => {
    var myId = useParams()[0];
    var sellerId = useParams()[1];
    var websocket = null;
    if('WebSocket' in window) {
        websocket = new WebSocket("/api/websocket/client/" + myId);
    } else {
        alert("Current Browser doesn't support websocket");
    }
    websocket.onopen = function () {
        console.log('Websocket Connects Successfully');
    }
    websocket.onmessage = function (event) {
        console.log(event);
        var html = document.getElementById('infoData').innerHTML;
        document.getElementById('infoData').innerHTML = html + "";
    }
    function send(){
        var message = document.getElementById("message").value;
        var acceptId = sellerId;
        var model = {
            "message": message,
            "sendType":"MESSAGE",
            "acceptId": acceptId,
        }
        websocket.send(JSON.stringify(model));
    }
    function webclose(){
        websocket.close();
    }
    return(
        <div>
        </div>
    )
}