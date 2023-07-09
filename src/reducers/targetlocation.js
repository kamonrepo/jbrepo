import { FETCH_TARGETLOCS } from '../constants/actionTypes';

export default (sublocations = [], action) => {

    switch (action.type) {
        case FETCH_TARGETLOCS:
            return action.payload;        
        default:
            return sublocations; 
    }
};