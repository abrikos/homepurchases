import React, {useEffect} from 'react';
import {A, navigate, useRoutes} from "hookrouter";
import logo from "client/images/logo.png";
import AccessDenied from "client/views/access-denied";
export default function Cabinet(props) {
    return props.isAuth ? <div>
        CABINET
        <hr/>
        {props.isAuth ? 'AUTH':'NOT'}
    </div>
        : <AccessDenied/>

}


