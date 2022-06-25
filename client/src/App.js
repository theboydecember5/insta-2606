import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PageRender from "./customRouter/PageRender";
import Signin from "./pages/signin";
import Notify from "./components/notify/Notify";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/home";
import { useEffect, useRef } from "react";
import { refreshToken } from "./redux/actions/authAction";
import Header from "./components/Header";
import Register from "./pages/register";
import PrivateRouter from "./customRouter/PrivateRouter";
import StatusModal from "./components/StatusModal";
import { getPost } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionAction";

import io from "socket.io-client";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import SocketClient from "./SocketClient";
import { getNotifies } from "./redux/actions/notifyAction";

function App() {


  const { auth, status } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    // Socket IO
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });

    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getNotifies(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getPost(auth.token));
    }
  }, [dispatch, auth.token]);



  // Thông báo trên laptop (Notification API JavaScript)
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") { }
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") { }
      });
    }
  }, []);

  return (
    <Router>
      <Notify />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}

          {/* Socket Realtime */}
          {auth.token && <SocketClient />}

          <Route exact path="/" component={auth.token ? Home : Signin} />
          <Route exact path="/register" component={Register} />
          <PrivateRouter exact path="/:page" component={PageRender} />
          <PrivateRouter exact path="/:page/:id" component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;
