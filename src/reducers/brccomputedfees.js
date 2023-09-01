import { FETCH_COMPUTED_FEES, START_LOADING, END_LOADING } from '../constants/actionTypes';

export default (state = { isLoading: false, data: []}, action) => {

    switch (action.type) { 

        case START_LOADING: 
        console.log('reducer-return-START_LOADING: ', {...state, isLoading: true });
        return {...state, isLoading: true }
  
        case END_LOADING: 
        console.log('reducer-return-END_LOADING: ',  {...state, isLoading: false });
        return {...state, isLoading: false }

        case FETCH_COMPUTED_FEES:
            console.log('reducer-return-FETCH_COMPUTED_FEES: ',  { ...state, data: action.payload } );
            return { ...state, data: action.payload };
        default:
            console.log('reducer-return-DEFAULT: ',  state);
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