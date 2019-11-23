import React, {useEffect, useState} from "react";
import {t, _} from "client/components/Translator";
import Loader from "client/components/Loader";
import Select from "react-select";
import {A} from "hookrouter";
import InputSelect from "client/components/InputSelect";

export default function GroupsSelect(props) {
/*
    const [groups, setGroups] = useState();

    useEffect(getGroups, []);



    function getGroups() {
        props.api('/group/list/user')
            .then(res => setGroups(res))
    }
*/

    function setDefaultGroup(value) {
        props.api('/cabinet/update/default-group/'+ value)
            .then(() => {
                //getGroups();
                props.onChange(value);
            })
    }


    function adaptToOption(g) {
        return {value: g.id, label: g.name}
    }

    const options = ()=>[
        {label: _('My groups'), options: props.groups.my.map(adaptToOption), className:'text-primary'},
        {label: _('In groups'), options: props.groups.invited.map(adaptToOption), className:'text-info'},
    ];

    const formatGroupLabel = data => (
        <div className={'d-flex justify-content-between'}>
            <span>{data.label}</span>
            <strong>({data.options.length})</strong>
        </div>
    );

    //if(!groups.my.length && !groups.invited.length) return <A href={'/cabinet/groups/my'}>{t('You are not a member of any groups. Create your own or ask your parents to include you in their groups.')}</A>
    return <div>
        <strong>{t('Choose group')}:</strong>
        <InputSelect
            formatGroupLabel={formatGroupLabel}
            onChange={setDefaultGroup}
            defaultValue={props.default.id}
            options={options()}/>
    </div>


}
