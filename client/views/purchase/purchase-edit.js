import React, {useEffect, useState} from 'react';
import AccessDenied from "client/service/access-denied";
import Loader from "client/components/Loader";
import {t} from "client/components/Translator";
import {RIEInput} from 'riek'
import {Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import GoodForm from "client/views/purchase/good-form";

export default function PurchaseEdit(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [purchase, setPurchase] = useState();
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setPurchase(props.purchase)
    }, [props.purchase])

    function handlePurchaseUpdated(p) {
        setPurchase(p);
        props.onChangePurchase(p);
    }

    function changeName(e) {
        e.preventDefault()
        const array = Array.from(e.target.elements).filter(f => !!f.name)
        const obj = {};
        const errs = [];
        for (const a of array) {
            obj[a.name] = a.value
            if (!obj.name) {
                errs.push('name')
                continue
            }
            //if (a.name === 'name' && !a.value) errors.push(a.name)
        }
        setErrors(errs)
        if (errs.length) return e.target.reset()
        props.api(`/purchase/${purchase.id}/save`, obj)
            .then(handlePurchaseUpdated)
    }

    const protoGood = {name: '', quantity: 0, price: 0, proto: true}
    if (!purchase) return <div/>;
    return <div>
        <div className={'container alert alert-info purchase-edit'}>
            <div className={'row'}>
                <span className={'col-4'}>{t('Name')}</span>
                <span className={'col-2'}>{t('Quantity')}</span>
                <span className={'col-2'}>{t('Price')}</span>
                <span className={'col-2'}>{t('Cost')}</span>
                <span className={'col-2'}></span>
            </div>
            <GoodForm purchase={purchase} good={protoGood} onChangeGood={handlePurchaseUpdated} {...props}/>
            <hr/>
            {purchase.goods.map((g, i) => {
                g.index = i;
                return g
            }).reverse().map((g) => <GoodForm key={g._id} purchase={purchase} good={g} onChangeGood={handlePurchaseUpdated} {...props}/>)}
            <hr/>
            <div className={'row'}>
                <span className={'col-8'}>{t('Total')}</span>
                <span className={'col-2 text-center'}>{purchase.sum}</span>
                <span className={'col-2'}></span>
            </div>
            <hr/>
            <Form className={'row'} onSubmit={changeName}>

                <Label for="changeName" className="col-2">{t('Change name')}</Label>
                <span className="col-8">
                <Input name="name" id="changeName"  defaultValue={purchase.name} onFocus={e => e.target.select()} invalid={errors.includes('name')}/>
                <FormFeedback>{t('Required')}</FormFeedback>
                </span>
                <span className="col-2">
                <Button size={'sm'}>{t('Save')}</Button>
                </span>

            </Form>
        </div>
    </div>

}
