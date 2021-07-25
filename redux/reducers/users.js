import { USERS_STATE_CHANGE, USERS_POST_STATE_CHANGE} from "../constants";

const initialState = {
    users: [],
    userLoaded: 0

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
                userLoaded: state.userLoaded + 1,
                users : state.users.map(user => user.uid === action.uid?
                    {...user,posts:action.posts}
                    :user)
            }
    
        default:
            return state
    }
    
}