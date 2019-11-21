import {Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import MyBreadCrumb from "client/components/MyBreadCrumb";
import AccessDenied from "client/views/access-denied";
//import Loader from "client/components/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import NotFound from "client/views/notfound";

export default function CabinetEditGroup(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;

    const [errors, setErrors] = useState([]);
    const [group, setGroup] = useState();
    useEffect(getGroup, []);

    function handleSubmit(e) {
        e.preventDefault();
        const array = Array.from(e.target.elements).filter(f => !!f.name)
        //.map(f=>{ return {name:f.name, value:f.value}; })
        const form = {};
        for (const a of array) {
            form[a.name] = a.value
            if (a.name === 'name' && !a.value) errors.push(a.name)
        }
        if (errors.length) return getGroup();
        //console.log(form)
        props.api(`/group/${props.id}/save/`, form)
            .then(group => getGroup());
        e.target.reset();
    }

    function getGroup() {
        props.api(`/group/${props.id}/owner-view`)
            .then(group => {
                setGroup(group);
            });
    }


    function attachToGroup(id) {
        props.api(`/group/${group.id}/attach-user/${id}`)
            .then(() => {
                getGroup()
            })
    }

    function detachFromGroup(id) {
        props.api(`/group/${group.id}/detach-user/${id}`)
            .then(() => {
                getGroup()
            })
    }

    console.log(group)
    if(!group) return <div>Loading...</div>
    return  <div>
        <MyBreadCrumb items={[
            {href: '/cabinet', label: t('Cabinet')},
            {href: '/cabinet/groups/my', label: t('My groups')},
            {label: t('Edit group')},
        ]}/>

        <Form onSubmit={handleSubmit} className={'alert alert-info'}>

            <FormGroup>
                <Label for={'groupName'}>{t('Name')}</Label>
                <Input name={'name'} id={'groupName'} invalid={errors.includes('name')} defaultValue={group.name}/>
                <FormFeedback>{t('Required')}</FormFeedback>
            </FormGroup>

            <Button>{t('Save')}</Button>
        </Form>

        <h3>{t('Members')}</h3>
        <table className={'table table-striped'}>
            <thead className="thead-dark">
            <tr>
                <th>{t('Name')}</th>
                <th>{t('Available')}</th>
                <th>{t('Connected')}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th colSpan={3} className={'text-center'}><small>{t('Referrals')}</small></th>
            </tr>
            {group.owner.referrals && group.owner.referrals.map((ref, i) => <tr key={i}>
                <td>{ref.first_name}</td>
                <td>{!group.members.map(m => m.id).includes(ref.id) && <Button onClick={() => attachToGroup(ref._id)}><FontAwesomeIcon icon={faArrowRight}/></Button>}</td>
                <td>{group.members.map(m => m.id).includes(ref.id) && <Button onClick={() => detachFromGroup(ref._id)}><FontAwesomeIcon icon={faArrowLeft}/></Button>}</td>
            </tr>)}
            </tbody>
            <tbody>
            <tr>
                <th colSpan={3} className={'text-center'}><small>{t('Parents')}</small></th>
            </tr>
            {group.owner.parents && group.owner.parents.map((par, j) => <tr key={j}>
                <td>{par.first_name}</td>
                <td>{!group.members.map(m => m.id).includes(par.id) && <Button onClick={() => attachToGroup(par._id)}><FontAwesomeIcon icon={faArrowRight}/></Button>}</td>
                <td>{group.members.map(m => m.id).includes(par.id) && <Button onClick={() => detachFromGroup(par._id)}><FontAwesomeIcon icon={faArrowLeft}/></Button>}</td>
            </tr>)}

            </tbody>
        </table>
    </div>
}
