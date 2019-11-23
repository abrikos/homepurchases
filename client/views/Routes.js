import React from "react";
import Home from "client/views/home";
import Contacts from "client/views/contacts";
import Login from "client/views/login";
import Cabinet from "client/views/cabinet";
import CabinetGroupEdit from "client/views/cabinet-group-edit";
import CabinetGroups from "client/views/cabinet-groups";
import CabinetLink from "client/views/cabinet-link";
import CabinetReferrals from "client/views/cabinet-referrals";
import CabinetParents from "client/views/cabinet-parents";
import GroupView from "client/views/group-view";
import PurchaseView from "client/views/purchase-view";

export default function Routes(props){

    return {
        "/": () => <Home {...props}/>,
        "/login": () => <Login {...props}/>,
        "/cabinet": () => <Cabinet {...props}/>,
        "/cabinet/groups/:type": ({type}) => <CabinetGroups type={type} {...props}/>,
        "/cabinet/referrals": () => <CabinetReferrals {...props}/>,
        "/cabinet/parents": () => <CabinetParents {...props}/>,
        "/cabinet/link": () => <CabinetLink {...props}/>,
        "/cabinet/group/:id/edit": ({id}) => <CabinetGroupEdit id={id} {...props}/>,
        "/contacts": () => <Contacts {...props}/>,
        "/group/:id": ({id}) => <GroupView id={id} {...props}/>,
        "/purchase/:id": ({id}) => <Home purchaseId={id} {...props}/>,
    };
}
