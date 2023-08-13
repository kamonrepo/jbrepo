import { FETCH_PAYMENT } from '../constants/actionTypes';

export default (payments = [], action) => {

    switch (action.type) {
        case FETCH_PAYMENT:
            return action.payload;        
        default:
            return payments; 
    }
};