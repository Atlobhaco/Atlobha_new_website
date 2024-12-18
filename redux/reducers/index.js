import { combineReducers } from "redux";
import authReducer from "./authReducer";
import basketReducer from "./basketReducer";
import LookupsReducer from "./LookupsReducer";
import selectedCarReducer from "./selectedCarReducer";
import selectedAddressReducer from "./selectedAddressReducer";
// import yourReducer from "./yourReducer"; // Ensure the path is correct

const rootReducer = combineReducers({
  auth: authReducer,
  basket: basketReducer,
  selectedCar: selectedCarReducer,
  lookups: LookupsReducer,
  selectedAddress: selectedAddressReducer,
});

export default rootReducer;
