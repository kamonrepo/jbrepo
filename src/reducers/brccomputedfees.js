import { FETCH_COMPUTED_FEES, START_LOADING, END_LOADING } from '../constants/actionTypes';

export default (state = { isLoading: false, data: []}, action) => {

    switch (action.type) { 

        case START_LOADING: 
        return {...state, isLoading: true }
  
        case END_LOADING: 
        return {...state, isLoading: false }

        case FETCH_COMPUTED_FEES:
            return { ...state, data: action.payload };
        default:
            return state; 
    }

    //export default (brcComputation = [], action) 
    // switch (action.type) { 

    //     case FETCH_COMPUTED_FEES:

    //         console.log('reducer-return-FETCH_COMPUTED_FEES: ',  { isLoading: true, data: action.payload });
    //         return action.payload;     

    //     default:
    //         console.log('reducer-return-default: ',  brcComputation);
    //         return brcComputation; 
    // }
    
};