import React from "react";
import Home from "client/views/home";
import Contacts from "client/views/contacts";
import Portfolio from "client/views/portfolio";
import Login from "client/views/login";
import Cabinet from "client/views/cabinet";
import CabinetEditGroup from "client/views/cabinet-edit-group";
import CabinetGroups from "client/views/cabinet-groups";
import CabinetLink from "client/views/cabinet-link";
import CabinetReferrals from "client/views/cabinet-referrals";
import CabinetParents from "client/views/cabinet-parents";

export default function Routes(props){

    return {
        "/": () => <Home {...props}/>,
        "/login": () => <Login {...props}/>,
        "/cabinet": () => <Cabinet {...props}/>,
        "/cabinet/groups": () => <CabinetGroups {...props}/>,
        "/cabinet/referrals": () => <CabinetReferrals {...props}/>,
        "/cabinet/parents": () => <CabinetParents {...props}/>,
        "/cabinet/link": () => <CabinetLink {...props}/>,
        "/cabinet/group/edit/:id": ({id}) => <CabinetEditGroup id={id} {...props}/>,
        "/contacts": () => <Contacts {...props}/>
    };
}
