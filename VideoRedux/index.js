import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./reducers";

const persistConfig = {
  key: "testDB",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
  keyPrefix: "react",
  version: 1,
  timeout: 0,
  blacklist: ["metaData", "misc", "cart", "topic"],
  whitelist: ["user", "order"],
};

const middlewares = [thunk];

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, applyMiddleware(...middlewares));

export const persistor = persistStore(store);
