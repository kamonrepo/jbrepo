import { FETCH_SUBLOCS } from '../constants/actionTypes';

export default (sublocations = [], action) => {
    switch (action.type) {
        case FETCH_SUBLOCS:
            return action.payload;        
        default:
            return sublocations; 
    }
};