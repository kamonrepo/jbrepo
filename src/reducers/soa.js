import { FETCH_SOA_BY_PMSGID, START_LOADING_SOAS,END_LOADING_SOAS, FETCH_SOAS } from '../constants/actionTypes';


export default (state = { isSOALoading: true }, action) => {

    switch (action.type) {

        case START_LOADING_SOAS: 
            return {...state, isSOALoading: true }

        case END_LOADING_SOAS: 
            return {...state, isSOALoading: false }

        case FETCH_SOAS:
            return action.payload;    

        case FETCH_SOA_BY_PMSGID:
            return { ...state, soa: action.payload }      

        default:
            return state; 
    }
};


// export default (soas = [], action) => {

//     switch (action.type) {

//         case FETCH_SOAS:

//         return action.payload;    

//         case FETCH_SOA_BY_PMSGID:

//             return action.payload;        

//         default:
//             return soas; 
//     }
// };