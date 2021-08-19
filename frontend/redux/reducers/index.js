import { combineReducers } from "redux";
import {User} from './user'
import {Users} from './users'

const Reducers = combineReducers({
    userState: User,
    usersState: Users
})

export default Reducers