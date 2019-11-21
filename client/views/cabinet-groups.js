import {Button, Input} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {navigate} from "hookrouter";
import AccessDenied from "client/views/access-denied";
import MyBreadCrumb from "client/components/MyBreadCrumb";

export default function CabinetGroups(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [groupsList, setGroupsList] = useState();

    function addNewGroup() {
        props.api('/cabinet/group/create')
            .then(group => {
                navigate('/cabinet/group/edit/' + group.id)
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        getGroupsList()
    }, [])

    function getGroupsList() {
        props.api(`/cabinet/group/list`)
            .then(res => {
                let content;
                console.log(res)
                if (res.error) return;

                content = <table className={'table'}>
                    <tbody>
                    <tr>
                        <th>{t('Name')}</th>
                        <th>{t('Date')}</th>
                        <th>{t('Members')}</th>
                    </tr>
                    {res[props.type].map(group => <tr key={group.id}>
                        <td>{props.type === 'my' ? <Input defaultValue={group.name} onChange={e => groupChange(group.id, 'name', e.target.value)}/> : <span>{group.name}</span>}</td>
                        <td>{group.updated}</td>
                        <td>{group.members.length}</td>
                        <td><Button onClick={() => navigate('/cabinet/group/edit/' + group.id)}><FontAwesomeIcon icon={faEdit} size={'xs'}/></Button></td>
                    </tr>)}
                    </tbody>
                </table>
                setGroupsList(content)
            })
    }

    function groupChange(id, field, value) {
        props.api('/cabinet/group/update/' + id, {field, value})
    }

    return <div>
        <MyBreadCrumb items={[
            {href: '/cabinet', label: t('Cabinet')},
            {label: props.type === 'my' ? t('My groups') : t('In groups')},
        ]}/>
        {props.type === 'my' && <Button onClick={addNewGroup}>
            <FontAwesomeIcon icon={faPlus}/> {t('Add new group')}
        </Button>}
        {groupsList}
    </div>
}
