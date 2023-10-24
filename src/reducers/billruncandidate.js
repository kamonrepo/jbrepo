import { FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN, FETCH_BILLRUN_CAN_BY_ID, FETCH_BILLRUN_CAN_BY_MP } from '../constants/actionTypes';

export default (billrunCandidate = [], action) => {
  
    switch (action.type) { 

        case FETCH_BILLRUN_CAN:
            return action.payload;     

        case FETCH_BILLRUN_CAN_BY_ID:
            return action.payload;   
            
        case FETCH_BILLRUN_CAN_BY_MP:
            return action.payload;  

        case UPDATE_BILLRUN_CAN:
            return billrunCandidate.map((brc) => (brc._id === action.payload._id ? action.payload: brc));

        default:
            return billrunCandidate; 
    }
};