import React, {useEffect, useState} from "react";
import {t} from "client/components/Translator";
import Loader from "client/components/Loader";
import Select from "react-select";
import {A} from "hookrouter";

export default function HomePurchasesSelect(props) {
    const [purchases, setPurchases] = useState();
    const [purchase, setPurchase] = useState();
    useEffect(getPurchases, []);

    useEffect(()=>{
        getPurchases()
        setPurchase(props.purchase)
    }, [props.purchase, props.group])


    function getPurchases() {
        props.api(`/group/${props.group.id}/purchases`)
            .then(setPurchases)
    }

    function adaptToOption(g) {
        return {value: g.id, label: `${g.name}  (${g.sum})`}
    }

    const options =()=> [
        {label: t('Open'), options: purchases.filter(p=>!p.closed).map(adaptToOption)},
        {label: t('Closed'), options: purchases.filter(p=>p.closed).map(adaptToOption)},
    ];

    const formatPurchaseLabel = data => (
        <div className={'d-flex'}>
            <span>{data.label}zz</span>
            <strong>({data.options.length})</strong>
        </div>
    );


    return <div>
        <strong>{t('Choose purchase')}:</strong>
        {purchases && <Select
            formatPurchaseLabel={formatPurchaseLabel}
            onChange={props.onChangeSelectPurchase}
            value={adaptToOption(purchase)}
            options={options()}/>}

    </div>


}
