import {Button, Input} from "reactstrap";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSave} from "@fortawesome/free-solid-svg-icons";

export default function GoodForm(props) {
    const [good, setGood] = useState(props.good);

    function formToObject(form) {
        const array = Array.from(form.elements).filter(f => !!f.name)
        const obj = {};
        for (const a of array) {
            obj[a.name] = a.value
            //if (a.name === 'name' && !a.value) errors.push(a.name)
        }
        return obj
    }

    function saveGood(e) {
        e.preventDefault();
        //const form = formToObject(e.target);
        if (good._id) {
            props.api(`/purchase/${props.purchase.id}/good/${good.index}/save`, good)
                .then(p => props.onChangeGood(p));
        } else {
            props.api(`/purchase/${props.purchase.id}/good/add`, good)
                .then(p => props.onChangeGood(p));
            e.target.reset();
        }

    }

    function goodChange(e) {
        const form = formToObject(e.target.form);
        const obj = {};
        for(const f in good){
            if(form[f])
                obj[f] = form[f]
            else
                obj[f] = good[f]
        }
        setGood(obj)
    }

    function selectText(e) {
        e.target.select()
    }

    return <form onSubmit={saveGood} onChange={goodChange} className={'good-form'}>
        <div className={'row'}>
            <div className={'col-4'}><Input className={'form-control-sm'} name={'name'} onFocus={selectText} defaultValue={good.name}/></div>
            <div className={'col-2'}><Input className={'form-control-sm'} name={'quantity'} type={'number'}  onFocus={selectText} defaultValue={good.quantity}/></div>
            <div className={'col-2'}><Input className={'form-control-sm'} name={'price'} type={'number'}  onFocus={selectText} defaultValue={good.price}/></div>
            <div className={'col-2 d-flex justify-content-center align-items-center'}>{good.quantity * good.price}</div>
            <div className={'col-2'}>
                {good._id ? <Button size={'sm'} color={'link'}> <FontAwesomeIcon icon={faSave}/></Button>
                    :
                <Button size={'sm'} color={'primary'}><FontAwesomeIcon icon={faPlus} size={'xs'}/></Button>}
            </div>
        </div>
    </form>
}
