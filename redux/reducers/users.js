import { USERS_STATE_CHANGE, USERS_POST_STATE_CHANGE, CLEAR_DATA} from "../constants";

const initialState = {
    users: [],
    feed:[],
    userFollowingLoaded: 0
}

export const Users = (state = initialState,action)=>{    
    switch (action.type) {
        case USERS_STATE_CHANGE:
            return{
                ...state,
                users:[...state.users,action.user]
            }
        case USERS_POST_STATE_CHANGE:
            return{
                ...state,
                feed : [...state.feed,...action.posts],
                userFollowingLoaded: state.userFollowingLoaded + 1,
                
            }
        case CLEAR_DATA:
            return {
                users: [],
                userFollowingLoaded: 0
            }
        default:
            return state
    }
    
}