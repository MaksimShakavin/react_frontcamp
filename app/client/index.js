import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import App from './spa/App';
import configureStore from './store'
import { Provider } from "react-redux";

const store = configureStore(window.PRELOADED_STATE);
delete window.PRELOADED_STATE;

ReactDOM.render((
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
), document.getElementById("app"));
