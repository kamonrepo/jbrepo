import { combineReducers } from 'redux';
import authReducer from './auth.js';
import locationReducer from './locations.js';
import groupReducer from './group';
import clientReducer from './client';
import billRunReducer from './billrun';
import billRunCanReducer from './billruncandidate';
import categoryReducer from '././services/category';

export default combineReducers({ 
    auth: authReducer,
    locations: locationReducer,
    categories: categoryReducer,
    groups: groupReducer,
    clients: clientReducer,
    billruns: billRunReducer,
    billruncandidates: billRunCanReducer
});
