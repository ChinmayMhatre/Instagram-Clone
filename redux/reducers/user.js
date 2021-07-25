import { USER_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_FOLLOWING } from "../constants";

const initialState = {
    currentUser: null,
    posts:[],
    following : []
}

export const User = (state = initialState,action)=>{    
    switch (action.type) {
        case USER_STATE_CHANGE:
            return{
                ...state,
                currentUser:action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return{
                ...state,
                posts:action.posts
            }
        case USER_FOLLOWING:
            return{
                ...state,
                following:action.following
            }
    
        default:
            return state
    }
    
}