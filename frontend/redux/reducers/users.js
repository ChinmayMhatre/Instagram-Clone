import { USERS_STATE_CHANGE, USERS_POST_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE} from "../constants";

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
            console.log(state.userFollowingLoaded)
            return{
                ...state,
                userFollowingLoaded: state.userFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts]
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} :
                    post)
            }
        case CLEAR_DATA:
            return {
                users: [],
                userFollowingLoaded: 0,
                feed:[]
            }
        default:
            return state
    }
    
}