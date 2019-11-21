import {Button, Input} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {navigate} from "hookrouter";
import AccessDenied from "client/views/access-denied";
import MyBreadCrumb from "client/components/MyBreadCrumb";
import {A} from "hookrouter";

export default function CabinetGroups(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [groups, setGroups] = useState();

    function addNewPurchase() {
        props.api('/group/create')
            .then(group => {
                navigate(`/cabinet/group/${group.id}/edit`)
            })
            .catch(error => console.error(error))
    }

    useEffect(getGroupsList, [])

    function getGroupsList() {
        props.api(`/group/list/user`)
            .then(groups => setGroups(groups))
    }
console.log(groups)
    function groupChange(id, field, value) {
        const body = {};
        body[field] = value;
        props.api('/group/save/' + id, body)
    }

    return <div>
        <MyBreadCrumb items={[
            {href: '/cabinet', label: t('Cabinet')},
            {label: props.type === 'my' ? t('My groups') : t('In groups')},
        ]}/>
        {props.type === 'my' && <Button onClick={addNewPurchase}>
            <FontAwesomeIcon icon={faPlus}/> {t('Add new group')}
        </Button>}
        <table className={'table'}>
            <tbody>
            <tr>
                <th>{t('Name')}</th>
                {/*<th>{t('Date')}</th>*/}
                <th>{t('Members')}</th>
                <th></th>
            </tr>
            {groups && groups[props.type].map(group => <tr key={group.id}>
                <td>{props.type === 'my' ? <Input defaultValue={group.name} onChange={e => groupChange(group.id, 'name', e.target.value)}/> : <span>{group.name}</span>}</td>
                {/*<td>{group.updated}</td>*/}
                <td>{group.members.length}</td>
                <td><A href={`/cabinet/group/${group.id}/edit`}><FontAwesomeIcon icon={faEdit} size={'xs'}/></A></td>
            </tr>)}
            </tbody>
        </table>
    </div>
}
