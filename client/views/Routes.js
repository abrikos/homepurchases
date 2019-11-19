import React from "react";
import Home from "client/views/home";
import Contacts from "client/views/contacts";
import Portfolio from "client/views/portfolio";
import Login from "client/views/login";
import Cabinet from "client/views/cabinet";

export default function Routes(props){

    return {
        "/": () => <Home {...props}/>,
        "/login": () => <Login {...props}/>,
        "/cabinet": () => <Cabinet {...props}/>,
        "/contacts": () => <Contacts {...props}/>
    };
}
