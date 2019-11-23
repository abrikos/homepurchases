import React, {useEffect, useState} from 'react';
import AccessDenied from "client/service/access-denied";
import {t} from "client/components/Translator";
import {Button, Form, FormFeedback, Input, Label} from "reactstrap";
import PurchaseGoodForm from "client/views/home/purchase-good-form";

export default function PurchaseEdit(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [purchase, setPurchase] = useState();
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState();

    useEffect(() => {
        updatePurchase(props.purchase)
    }, [props.purchase])

    function handlePurchaseUpdated(p) {
        updatePurchase(p)
        props.onChangePurchase(p);
    }

    function updatePurchase(p) {
        if (!p) return;
        setName(p.name)
        setPurchase(p);
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

    function purchaseSwitchClosed() {
        props.api(`/purchase/${purchase.id}/switch`)
            .then(handlePurchaseUpdated)
    }

    const protoGood = {name: '', quantity: 0, price: 0, proto: true}
    if (!purchase) return <div/>;
    return <div>
        <div className={'container alert alert-primary purchase-edit'}>
            <div className={'row border border-bottom'}>
                <strong className={'col-4'}>{t('Name')}</strong>
                <strong className={'col-2'}>{t('Quantity')}</strong>
                <strong className={'col-2'}>{t('Price')}</strong>
                <strong className={'col-2'}>{t('Cost')}</strong>
                <span className={'col-2'}></span>
            </div>
            {purchase.closed || <PurchaseGoodForm purchase={purchase} good={protoGood} onChangeGood={handlePurchaseUpdated} {...props}/>}
            <div className={'text-danger'}>{t('Empty rows are deleted')}</div>
            {purchase.goods.map((g, i) => {
                g.index = i;
                return g
            }).reverse().map((g) => <PurchaseGoodForm key={g._id} purchase={purchase} good={g} onChangeGood={handlePurchaseUpdated} {...props}/>)}
            <div className={'row'}>
                <h3 className={'col-8'}>{t('Total')}</h3>
                <h3 className={'col-2 text-center'}>{purchase.sum}</h3>
                <span className={'col-2'}></span>
            </div>

            {purchase.closed ? <Button color={'success'} onClick={purchaseSwitchClosed}>{t('Open closed purchase')}</Button> : <Button color={'warning'} onClick={purchaseSwitchClosed}>{t('Close purchase')}</Button>}
            <hr/>
            <Form onSubmit={changeName}>
                <div><Label for="changeName">{t('Change name of purchase')}</Label></div>
                <div>


                </div>




                <div className="input-group">
                    <div className="input-group-prepend">
                        <Button size={'sm'}>{t('Save')}</Button>
                    </div>
                    <Input name="name" id="changeName" value={name} onFocus={e => e.target.select()} invalid={errors.includes('name')} onChange={e => setName(e.target.value)}/>
                    <FormFeedback>{t('Required')}</FormFeedback>

                </div>


            </Form>

        </div>
    </div>

}
