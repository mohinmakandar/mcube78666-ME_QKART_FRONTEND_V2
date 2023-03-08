import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
    // console.log("carts data: ",cartData);
    // console.log("products Data: ",productsData);

    if(!cartData){ 
      return;
    }

    //We spread the original objects data and returned it as a single object for every iteration to store it in nextCart
    //e.g. {qty:2,productId: xyz, name:'leather jacket', _id: xyz}
    const nextCart = cartData.map((item) => ({
      ...item,
      ...productsData.find((product)=> item.productId===product._id),
      }));

      return nextCart;

};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {

  let sum =0;
  items.map((item)=>{
    sum+= (item.cost*item.qty);
    return sum;
   })
 return sum;   
};


// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {

  let cnt=0;

  items.map((item,i)=>{
    cnt++;
  })

  return cnt;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {

  if(isReadOnly){
    return(
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>

    );
  }
 
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  

  let token = localStorage.getItem("token");
  const history =useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {
          
          items.map((item)=>(
            <Box key = {item.productId}>
              { 
                item.qty>0?(
                  <Box display="flex" alignItems="flex-start" padding="1rem">
                    <Box className="image-container">
                        <img
                            // Add product image
                            src={item.image}
                            // Add product name as alt eext
                            alt={item.name}
                            width="100%"
                            height="100%"
                        />
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height="6rem"
                        paddingX="1rem"
                    >
                        <div>
                        {/* Add product name */
                          item.name
                        }</div>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                        <ItemQuantity
                        // Add required props by checking implementation
                        value={item.qty}

                        handleAdd={async ()=>{
                          await handleQuantity(token,items,products, item.productId, item.qty + 1);
                        }}

                        handleDelete = {async ()=>{
                          await handleQuantity(token,items,products,item.productId,item.qty - 1);
                        }}

                        isReadOnly={isReadOnly}
                        />
                        <Box padding="0.5rem" fontWeight="700">
                            ${/* Add product cost */
                              item.cost  
                            }
                        </Box>
                        </Box>
                    </Box>
                  </Box>

                ):""

              }
            </Box>
            

          ))
          
        }
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly?(
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>{history.push("/checkout")}}
          >
            Checkout
          </Button>
        </Box>
        ):
        ""
        }
        
      </Box>
      
      {isReadOnly?(
        <Box className="cart" paddingX="1rem" paddingTop="2rem" paddingBottom="1.5rem">
          <Box
            color="#3C3C3C"
            fontWeight="750"
            fontSize="1.5rem"
            alignSelf="center"
          >
          Order Details
          </Box>

          <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
          >
            <Box color="#3C3C3C" alignSelf="start">
              Products
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              {getTotalItems(items)}
            </Box>

          </Box>

          <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
          >
            <Box color="#3C3C3C" alignSelf="start">
              Subtotal
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${getTotalCartValue(items)}
            </Box>
          </Box>

          <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
          >
            <Box color="#3C3C3C" alignSelf="start">
              Shipping Charges
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${0}
            </Box>
          </Box>

          <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
          fontWeight="700"
          fontSize="1.25rem"
          >
            <Box color="#3C3C3C" alignSelf="start">
              Total
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${getTotalCartValue(items)}
            </Box>
          </Box>    
        </Box>

        ):
        "" 
      } 
    </>
  );
};

export default Cart;
