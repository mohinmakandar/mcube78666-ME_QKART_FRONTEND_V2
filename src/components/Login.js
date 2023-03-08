import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [isLoading,setLoadValue] = useState(false);
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    const {username, password} = formData;
    if(validateInput(formData)===false){
      return;
    }
    
    setLoadValue(true);
      axios.post(config.endpoint+"/auth/login", formData).then(
        function (response){
            enqueueSnackbar("Logged in successfully",{variant:"success"});
            setLoadValue(false);
            // This redirects from login page to products page
            persistLogin(response.data.token, response.data.username,response.data.balance);
            history.push("/",{from: "Login"});
        }
      ).catch(
        function (err){
            if(err.response.status>=400){
              enqueueSnackbar("Password is incorrect",{variant:"error"});
            }
            else{
              enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"});
            }
            setLoadValue(false);
          
        } 
      );


  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {

    if(data.username===""){
      enqueueSnackbar("Username is a required field",{variant: "warning"});
      return false;
    }
    else if(data.password===""){
      enqueueSnackbar("Password is a required field",{variant: "warning"});
      return false;
    }
    else{
      return true;
    }

  };

  const handleInput = (e)=>{
    let target = e.target;

    if(target.name==="username"){
     
      setUsername(target.value);
    
    }else if(target.name==="password"){
      setPassword(target.value);
    }
  }

  const renderOnCondition=()=>{
    if(isLoading){
      return (
        <div className="circularprogressdiv">  
          <CircularProgress />
        </div>
      );
    }
    else{
      return (
        <Button variant="contained" onClick={()=>{login({"username":username,"password":password});}}>LOGIN TO QKART</Button>
      );
      
    }
  }

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
 
    localStorage.setItem("username",username);
    localStorage.setItem("token",token);
    localStorage.setItem("balance",balance);

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={username}
            placeholder="Enter Username"
            fullWidth
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleInput}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          {renderOnCondition()}
          <p className="secondary-action">
            Don't have an account?{" "}
             <Link className="link" to="/Register">
              Register Now
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
