import React, {useEffect, useState} from "react";
import AccessDenied from "client/views/access-denied";
import {t} from "client/components/Translator";
import MyBreadCrumb from "client/components/MyBreadCrumb";

export default function CabinetReferrals(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [content, setContent] = useState([]);

    useEffect(()=>{
        props.api('/cabinet/referrals')
            .then(referrals=>{

                setContent(referrals.map((r,i)=><tr key={i}><td>{r.first_name}</td><td>{r.date}</td></tr>))
            })
    },[]);

    return <div>
        <MyBreadCrumb items={[
            {href:'/cabinet', label:t('Cabinet')},
            {label:t('Invited by me')},
        ]}/>
        <table className={'table'}><tbody>
        {content}
        </tbody></table>
    </div>
}
