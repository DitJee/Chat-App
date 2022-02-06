import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

let socket;
const ENDPOINT = "localhost:5000";

const Chat = () => {
  // location
  const location = useLocation();

  // name
  const [name, setName] = useState("");

  // room
  const [room, setRoom] = useState("");

  // message
  const [message, setMessage] = useState("");

  // messages
  const [messages, setMessages] = useState([]);

  // call on user join
  useEffect(() => {
    // get room and name
    const { name, room } = queryString.parse(location.search);

    // setup the socket
    socket = io(ENDPOINT);
    console.log("🚀 ~ file: Chat.jsx ~ line 28 ~ useEffect ~ socket", socket);
    console.log("🚀 ~ file: Chat.jsx ~ line 10 ~ useEffect ~ room", room);
    console.log("🚀 ~ file: Chat.jsx ~ line 10 ~ useEffect ~ name", name);
    setRoom(room);
    setName(name);

    // emit from client side socket
    // enit on join
    socket.emit("join", { name: name, room: room }, () => {});

    // fires on unMount
    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [ENDPOINT, location.search]); // event will fire when params in list is changed

  // call on messages sent
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  //TODO: FUNCTION FOR SENDING MESSAGES

  return <h1> chat</h1>;
};

export default Chat;
