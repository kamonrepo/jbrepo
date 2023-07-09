import { combineReducers } from 'redux';
import authReducer from './auth.js';
import groupReducer from './group';
import sublocationReducer from './sublocation.js';
import targetlocationReducer from './targetlocation.js';
import clientReducer from './client';
import billRunReducer from './billrun';
import billRunCanReducer from './billruncandidate';
import categoryReducer from '././services/category';
import planReducer from '././services/plan';

export default combineReducers({ 
    auth: authReducer,
    categories: categoryReducer,
    groups: groupReducer,
    sublocations: sublocationReducer,
    targetlocations: targetlocationReducer,
    clients: clientReducer,
    billruns: billRunReducer,
    billruncandidates: billRunCanReducer,
    plan: planReducer
});
