import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar/NavigationBar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Data from './components/Data/Data';
import Location from './components/Location/Location';
import Client from './components/Client/Client';
import Group from './components/Group/Group';
import BillRun from './components/BillRun/BillRun';
import BillRunCandidate from './components/BillRunCandidate/BillRunCandidate';
import Services from './components/Services/Services';
import Plan from './components/Plan/Plan';
import Report from './components/Report/Report';

const App = () => {

    //const user = JSON.parse(localStorage.getItem('profile'));

    
    return (
        <BrowserRouter>
        <NavigationBar />
            <Container style={{ display: 'flex', marginTop: '99px'}}> 
                <Switch>
                    <Route path="/" exact component={Home} /> 
                    <Route path="/auth" exact component={Auth} />
                    <Route path="/data" exact component={Data} /> 
                    <Route path="/location" exact component={Location} /> 
                    <Route path="/client" exact component={Client} /> 
                    <Route path="/group" exact component={Group} /> 
                    <Route path="/billrun" exact component={BillRun} /> 
                    <Route path="/billruncandidate" exact component={BillRunCandidate} /> 
                    <Route path="/services" exact component={Services} /> 
                    <Route path="/plan" exact component={Plan} /> 
                    <Route path="/report" exact component={Report} /> 
                </Switch>
            </Container>
        </BrowserRouter>
    );
}

export default App;