import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Search} from "@mui/icons-material";
import { Avatar, Button, Stack, TextField, InputAdornment} from "@mui/material";
import {useHistory} from "react-router-dom"
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";
import Login from "./Login";
import { createNullishCoalesce } from "typescript";

const Header = ({ children, hasHiddenAuthButtons }) => {
    const history = useHistory();

    const authLogOut = ()=>{
        
      localStorage.clear();
      history.push("/",{from: "/"});

    }
    const authButtons = ()=>{
      return(
        <Box className="header-title">
          <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{history.push("/");}}
          >
            Back to explore
          </Button>
        </Box>  
      );
    }
    const noAuthButtons = ()=>{

      if(localStorage.getItem("username")===null){
        return(
          <Box className="header-title">
            <Button className="buttonlogin" onClick={() => { history.push("/login"); } }> Login</Button>
            <Button className="explore-button" variant="contained" onClick={() => { history.push("/register"); } } > <font color="white">Register</font></Button>
          </Box>
        );
      }
      else{
        return(
        <Box className="header-title">
          <Button className="buttonlogin"> <img src="avatar.png" alt={localStorage.getItem("username")} className="img-user" /> <span style={{color:"black"}}>{localStorage.getItem("username")}</span></Button>
          <Button className="buttonlogout" onClick={() => {authLogOut();window.location.reload()} }>Logout</Button>
        </Box>
        );
      }
    }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
          {children}
          {hasHiddenAuthButtons ? authButtons() : noAuthButtons()}   
      </Box>
    );
};

export default Header;
