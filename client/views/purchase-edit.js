import React, {useEffect, useState} from 'react';
import AccessDenied from "client/views/access-denied";
import Loader from "client/components/Loader";
import {t} from "client/components/Translator";
import {RIEInput} from 'riek'
import {Button} from "reactstrap";

export default function PurchaseEdit(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [purchase, setPurchase] = useState(props.purchase);


    function httpTaskCallback(body) {
        props.api(`/purchase/${purchase.id}/edit`, body)
            .then(p => setPurchase(p))
    }

    function addGood(e) {
        e.preventDefault();
        const array = Array.from(e.target.elements).filter(f => !!f.name)
        //.map(f=>{ return {name:f.name, value:f.value}; })
        const form = {};
        for (const a of array) {
            form[a.name] = a.value
            //if (a.name === 'name' && !a.value) errors.push(a.name)
        }
        //if (errors.length) return getGroup();
        //console.log(form)
        props.api(`/purchase/${purchase.id}/good/add`, form)
            .then(p => setPurchase(p));
        e.target.reset();

    }

    return <div>
        {/*{purchase && <InlineEdit text={purchase.name}/>}*/}
        {purchase && <RIEInput
            value={purchase.name}
            change={httpTaskCallback}
            propName='name'
            validate={v => !!v}
        />}

        <div className={'container alert alert-info'}>
            <div className={'row'}>
                <span className={'col'}>{t('Name')}</span>
                <span className={'col'}>{t('Quantity')}</span>
                <span className={'col'}>{t('Price')}</span>
                <span className={'col'}>{t('Cost')}</span>
            </div>
            <form onSubmit={addGood}>
                <div className={'row'}>
                    <input className={'col m-1'} name={'name'}/>
                    <input className={'col m-1'} name={'quantity'}/>
                    <input className={'col m-1'} name={'price'}/>
                    <input className={'col m-1'}/>
                </div>
                <Button className={'btn-sm'}>{t('Add')}</Button>
            </form>
        </div>
    </div>

}
