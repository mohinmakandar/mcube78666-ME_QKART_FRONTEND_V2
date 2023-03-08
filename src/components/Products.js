import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart"
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems]= useState([]);
  const [productsArray,setProducts] = useState([]);
  const [filteredProductsArray,setFilteredProducts] = useState([]);
  const [isLoading,setLoadValue] = useState(false);
  const [timerId,updateTimer] = useState("");
  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    try{
      // console.log("inside performAPICall");
  
      //setting the loading animation value to true
      setLoadValue(true);

      let apiURL= config.endpoint+"/products"; 
      let responseData = await axios.get(apiURL)
      
      setLoadValue(false);

      let data = await responseData.data;
      setProducts(data);
      setFilteredProducts(data);

      return data;  
        
    }catch(err){

        //set Load value to false
        setLoadValue(false);
        
        if(err.response.status===500){
          enqueueSnackbar(err.response.data.message, {variant:"error"});
          return null;
        }
        
    }

  };

  useEffect(()=>{
    async function fetchData() {
      
      //fetch all products
      let productsData = await performAPICall();

      //fetch cart data
      let cartData = await fetchCart(token);
      
      //merge cart and product details 
      let cartDetails = await generateCartItemsFrom(cartData,productsData);
      setCartItems(cartDetails);
    
      
    }
    fetchData();
    
    return () => {
      // console.log("unmounted");
  };
  },[]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{

        let apiURL = config.endpoint+"/products/search?value="+text;
        //console.log(searchKey);
        const responseData = await axios.get(apiURL)
        
        let data = await responseData.data;
        // setLoadValue(false);
        setFilteredProducts(data);
        return data;
        //console.log(data);
        
        
    }catch(err){

        if(err.response.status===404){
          setFilteredProducts([]);
          enqueueSnackbar("No Products Found",{variant:"error"});
        }
        
        if(err.response.status===500){
          enqueueSnackbar(err.response.data.message, {variant:"error"});
          //show no products banner
          setFilteredProducts(productsArray);
        }
        
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    clearTimeout(timerId);
    let timerIdLocal = setTimeout(async ()=>{
      let searchkey = event.target.value;
      let data = await performSearch(searchkey);

    },500);

    updateTimer(timerIdLocal);
    
  };


  const handleAddToCart = (e,productId)=>{

  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

       //setting headers to be set with every axios request
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      //setting url
      const url = config.endpoint+"/cart";

      //axios get request
      const APIResponse = await axios.get(url);
      return APIResponse.data;

      //console.log(APIResponse.data);

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {

    return items.find(item=>item.productId===productId)
  };


  /*Update Cart Items*/
  const updateCartItems = (cartData, products)=>{

    let cartDetails = generateCartItemsFrom(cartData,products);

    setCartItems(cartDetails);

  }
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

      //return with warning if not logged in
      if(!localStorage.getItem("username")){
        enqueueSnackbar("Login to add an item to the Cart",{variant: "warning"});
        return;
      }

      if(options.preventDuplicate && isItemInCart(items,productId)){
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
        return;
      }

      try{
        const res = await axios.post(
          `${config.endpoint}/cart`,
          {productId,qty},
          {
            headers: {
              Authorizaton: `Bearer ${token}`,
            },
          }
        ); 
        
        updateCartItems(res.data,products);
        
      }catch(e){
        enqueueSnackbar("Error adding to cart", {variant:"error"});
      }

  };


  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e)=>{debounceSearch(e,500);}}
      />

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e)=>{debounceSearch(e,500);}}
      />
       <Grid container>
          <Grid item className="product-grid" md={token!=null?9:12}>
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           {/*Check isloading true or not*/ }
           {
            isLoading?
            (<div className="loading">  
              <CircularProgress />
              <h4>Loading Products</h4>
            </div>
            ):
            <Grid container spacing={2} marginY="1rem" paddingX="1rem">
            {
              filteredProductsArray.length?  
                filteredProductsArray.map((p, index) => (
                <Grid item md={3} xs={6} key={p._id}>
                  <ProductCard product={p} handleAddToCart={async ()=> {await addToCart(token,cartItems,productsArray, p._id, 1,{preventDuplicate:true});}} />
                </Grid>
              )):
              <div className="no-products"><SentimentDissatisfied/><br/>No Products Found!</div>
            }
            </Grid>
          }
          </Grid>
          {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
          {token!=null?
            (<Grid item md={3} xs={12} bgcolor="#E9F5E1">
              <Cart products={productsArray} items={cartItems} handleQuantity={addToCart} isReadOnly={false}/>
              </Grid>
            ):
            ""
          }
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
