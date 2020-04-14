import React from 'react';
import {HashRouter} from 'react-router-dom';
import {Route, Switch} from 'react-router';
import './styles/app.scss';


import Home from './components/home';

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/' component={Home}/>
            </Switch>
        </HashRouter>
    );
}

export default App;
