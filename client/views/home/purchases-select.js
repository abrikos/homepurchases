import React, {useEffect, useState} from "react";
import {t, _} from "client/components/Translator";
import Loader from "client/components/Loader";
import Select from "react-select";
import {A} from "hookrouter";
import InputSelect from "client/components/InputSelect";

export default function PurchasesSelect(props) {
    const [purchases, setPurchases] = useState();
    //const [purchase, setPurchase] = useState();
    useEffect(getPurchases, []);

    useEffect(()=>{
        getPurchases()
        //setPurchase(props.purchase)
    }, [props.purchase, props.group])


    function getPurchases() {
        props.api(`/group/${props.group.id}/purchases`)
            .then(setPurchases)
    }

    function adaptToOption(g) {
        return {value: g.id, label: g.name}
    }

    const options =()=> [
        {label: _('Open'), options: purchases.filter(p=>!p.closed).map(adaptToOption)},
        {label: _('Closed'), options: purchases.filter(p=>p.closed).map(adaptToOption), className:'text-light bg-secondary'},
    ];

    const formatPurchaseLabel = data => (
        <div className={'d-flex'}>
            <span>{data.label}zz</span>
            <strong>({data.options.length})</strong>
        </div>
    );


    return <div>
        <strong>{t('Choose purchase')}:</strong>
        {purchases && <InputSelect
            formatPurchaseLabel={formatPurchaseLabel}
            onChange={props.onChangeSelectPurchase}
            defaultValue={props.default.id}
            options={options()}/>}

    </div>


}
