import { combineReducers } from "redux";
import {User} from './user'

const Reducers = combineReducers({
    userState: User
})

export default Reducers