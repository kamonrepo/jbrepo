import { FETCH_PLAN } from '../../constants/actionTypes';

export default (plan = [], action) => {

    switch (action.type) {
        case FETCH_PLAN:

            return action.payload;        

        default:
            return plan; 
    }
};