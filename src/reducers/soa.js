import { FETCH_SOA_BY_BRCID, FETCH_SOAS } from '../constants/actionTypes';

export default (soas = [], action) => {

    switch (action.type) {

        case FETCH_SOAS:

        return action.payload;    

        case FETCH_SOA_BY_BRCID:

            return action.payload;        

        default:
            return soas; 
    }
};