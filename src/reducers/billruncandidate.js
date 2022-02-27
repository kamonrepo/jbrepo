import { FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN } from '../constants/actionTypes';

export default (billrunCandidate = [], action) => {
  
    switch (action.type) {
        case FETCH_BILLRUN_CAN:
            return action.payload;        
        case UPDATE_BILLRUN_CAN:
            return billrunCandidate.map((brc) => (brc._id === action.payload._id ? action.payload: brc));
            // return billrunCandidate.map((brc) => console.log('brc-reducer::: ', brc));
        default:
            return billrunCandidate; 
    }
};