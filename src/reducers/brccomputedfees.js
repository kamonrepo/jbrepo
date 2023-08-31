import { FETCH_COMPUTED_FEES } from '../constants/actionTypes';

export default (brcComputation = [], action) => {
  
    switch (action.type) { 

        case FETCH_COMPUTED_FEES:
            return action.payload;     

        default:
            return brcComputation; 
    }
};