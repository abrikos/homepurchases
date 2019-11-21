import React, {useEffect, useState} from "react";
import {t} from "client/components/Translator";
import Loader from "client/components/Loader";
import Select from "react-select";
import {A} from "hookrouter";

export default function HomeGroups(props) {
    const [groups, setGroups] = useState();

    useEffect(getGroups, []);

    if (!groups) return <Loader/>;

    function getGroups() {
        props.api('/group/list/user')
            .then(res => setGroups(res))
    }

    function setDefaultGroup(group) {
        props.api('/cabinet/user/update/default-group', {id: group.value})
            .then(() => {
                getGroups();
                props.onChange(group.value);
            })
    }


    function adaptToOption(g) {
        return {value: g.id, label: g.name}
    }

    const options = [
        {label: t('My groups'), options: groups.my.map(adaptToOption)},
        {label: t('In groups'), options: groups.invited.map(adaptToOption)},
    ];

    const formatGroupLabel = data => (
        <div className={'d-flex justify-content-between'}>
            <span>{data.label}</span>
            <strong>({data.options.length})</strong>
        </div>
    );

    if(!groups.my.length && !groups.invited.length) return <A href={'/cabinet/groups/my'}>{t('You are not a member of any groups. Create your own or ask your parents to include you in their groups.')}</A>

    return <div>
        <strong>{t('Choose group')}:</strong>
        <Select
            formatGroupLabel={formatGroupLabel}
            onChange={setDefaultGroup}
            defaultValue={groups.default}
            options={options}/>
    </div>


}
