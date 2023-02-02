import { FETCH_PLAN, FETCH_PLAN_BY_CATEGORY_ID } from '../../constants/actionTypes';

export default (plan = [], action) => {

    switch (action.type) {
        case FETCH_PLAN:
            return action.payload;      
            
        case FETCH_PLAN_BY_CATEGORY_ID:
            return action.payload;     

        default:
            return plan; 
    }
};