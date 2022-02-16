export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_CART: "ADD_CART",
  ADD_MODAL: "ADD_MODAL",
  ADD_ORDERS: "ADD_ORDERS",
};

export const addToCart = (product, cart) => {
  if (product.inStock === 0) return console.log("product is out of stock");
  const check = cart.every((item) => {
    return item._id != product._id;
  });
  if (!check)
    return {
      type: ACTIONS.NOTIFY,
      payload: { error: "The product has been added to cart." },
    };

  return {
    type: ACTIONS.ADD_CART,
    payload: [...cart, { ...product, quantity: 1 }],
  };
};

export const increment = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });
  return { type: "ADD_CART", payload: newData };
};

export const decrement = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });
  return { type: "ADD_CART", payload: newData };
};

export const deleteItem = (data, id) => {
  let newData = [...data];
  newData = newData.filter((item) => item._id != id);

  return { type: "ADD_CART", payload: newData };
};
