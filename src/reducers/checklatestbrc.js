import { FETCH_CHECK_LATEST_BRC, START_LOADING_CLBRC, END_LOADING_CLBRC } from '../constants/actionTypes';

export default (state = { isBRCLoading: false, data: []}, action) => {

    switch (action.type) { 

        case START_LOADING_CLBRC: 
        return {...state, isBRCLoading: true }
  
        case END_LOADING_CLBRC: 
        return {...state, isBRCLoading: false }

        case FETCH_CHECK_LATEST_BRC:
            return { ...state, data: action.payload };
        default:
            return state; 
    }    
};