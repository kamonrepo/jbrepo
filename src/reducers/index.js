import { combineReducers } from 'redux';
import authReducer from './auth.js';
import groupReducer from './group';
import sublocationReducer from './sublocation.js';
import targetlocationReducer from './targetlocation.js';
import clientReducer from './client';
import billRunReducer from './billrun';
import billRunCanReducer from './billruncandidate';
import brcComputedFeesReducer from './brccomputedfees.js';
import categoryReducer from '././services/category';
import planReducer from '././services/plan';
import paymentReducer from './payment.js';
import postsReducer from './posts.js';
import soaReducer from './soa.js';
import reportReducer from './report.js';
import latestBrcReducer from './checklatestbrc.js';

export default combineReducers({ 
    auth: authReducer,
    categories: categoryReducer,
    groups: groupReducer,
    sublocations: sublocationReducer,
    targetlocations: targetlocationReducer,
    clients: clientReducer,
    billruns: billRunReducer,
    billruncandidates: billRunCanReducer,
    brccomputedfees: brcComputedFeesReducer,
    plan: planReducer,
    payments: paymentReducer,
    posts: postsReducer,
    soas: soaReducer,
    reports: reportReducer,
    latestbrc: latestBrcReducer
});
