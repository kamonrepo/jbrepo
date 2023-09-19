import { FETCH_SOA_BY_ID } from '../constants/actionTypes';

export default (soas = [], action) => {

    switch (action.type) {
        case FETCH_SOA_BY_ID:

            return action.payload;        

        default:
            return soas; 
    }
};