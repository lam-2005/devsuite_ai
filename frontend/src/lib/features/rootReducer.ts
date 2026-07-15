import { combineReducers } from "@reduxjs/toolkit";
import errorReducer from "@/lib/features/errorSlice";
const rootReducer = combineReducers({
  errors: errorReducer,
});
export default rootReducer;
