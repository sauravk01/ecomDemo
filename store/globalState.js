import { createContext, useEffect, useReducer } from "react";
import { ACTIONS } from "./Actions";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    cart: [],
    notify: {},
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  useEffect(() => {
    const someCart = JSON.parse(localStorage.getItem("some-cart"));
    if (someCart) dispatch({ type: ACTIONS.ADD_CART, payload: someCart });
  }, []);

  useEffect(() => {
    localStorage.setItem("some-cart", JSON.stringify(cart));
  }, [cart]);

  console.log("cart", cart);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
