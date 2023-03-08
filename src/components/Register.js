import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [isLoading,setLoadValue] = useState(false);
  const history = useHistory();


  const handleInput = (e)=>{
    
    let target = e.target;

    if(target.name==="username"){
     
      setUsername(target.value);
    
    }else if(target.name==="password"){
      setPassword(target.value);
    }
    else{
      setCPassword(target.value);
    }
  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = (formData) => {
   
    if(validateInput(formData)===false){
      return;
    }
    
    let data ={
      "username":formData.username,
      "password":formData.password
    }
    setLoadValue(true);
      axios.post(config.endpoint+"/auth/register", data).then(
        function (response){
            enqueueSnackbar("Success",{variant:"success"});
            setLoadValue(false);
            history.push("/login",{from : "Register" });
        }
      ).catch(
        function (err){
            if(err.response.status>=400){
              enqueueSnackbar("Username is already taken",{variant:"warning"});
            }
            else{
              enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"success"});
            }
            setLoadValue(false);
          
        } 
      );    
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
  const validateInput = (data) => {

    let uname = data.username;
    let pass = data.password;
    let cpass = data.confirmPassword;

    if(uname===""){
      enqueueSnackbar("Username is a required field",{variant:"warning"});
      return false;
    }
    
    if(pass!==cpass){
      enqueueSnackbar("Passwords do not match!",{variant:"error"});
      return false;
    }

    if(uname.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{variant:"warning"});
      return false;
    }

    if(pass===""){
      enqueueSnackbar("Password is a required field",{variant:"warning"});
      return false;
    }

    if(pass.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:"warning"});
      return false;
    }

    return true;

  };

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
        <Button variant="contained" onClick={()=>{register({"username":username,"password":password,"confirmPassword":cpassword})}}>
      Register Now
      </Button>
      );
      
    }
  }


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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={username}
            onChange={handleInput}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleInput}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={cpassword}
            onChange={handleInput}
            fullWidth
          />
          
          {renderOnCondition()}
        
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/Login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
