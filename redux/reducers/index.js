import { combineReducers } from "redux";
import authReducer from "./authReducer";
import basketReducer from "./basketReducer";
import LookupsReducer from "./LookupsReducer";
import selectedCarReducer from "./selectedCarReducer";
import selectedAddressReducer from "./selectedAddressReducer";
import addSparePartsReducer from "./addSparePartsReducer";
import quickSectionsProfile from "./quickSectionsProfile";
import appGroups from "./appGroups";
import selectedPaymentMethod from "./selectedPaymentMethod";
import homeSections from "./homeSectionsReducer";
// import yourReducer from "./yourReducer"; // Ensure the path is correct

const rootReducer = combineReducers({
  auth: authReducer,
  basket: basketReducer,
  selectedCar: selectedCarReducer,
  lookups: LookupsReducer,
  selectedAddress: selectedAddressReducer,
  addSpareParts: addSparePartsReducer,
  quickSection: quickSectionsProfile,
  appGroups: appGroups,
  selectedPaymentMethod: selectedPaymentMethod,
  homeSectionsData: homeSections,
});

export default rootReducer;
