import { FETCH_BILLRUN } from '../constants/actionTypes';

export default (billruns = [], action) => {
    switch (action.type) {
        case FETCH_BILLRUN:
            return action.payload;        

        default:
            return billruns; 
    }
};