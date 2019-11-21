import {Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import MyBreadCrumb from "client/components/MyBreadCrumb";
import AccessDenied from "client/views/access-denied";
import Loader from "client/components/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

export default function CabinetEditGroup(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;

    const [errors, setErrors] = useState([]);
    const [group, setGroup] = useState({});

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
        props.api('/cabinet/group/save/' + props.id, form)
            .then(group => getGroup());
        e.target.reset();
    }

    function getGroup() {
        props.api('/cabinet/group/view/' + props.id)
            .then(group => {
                console.log(group)
                setGroup(group);
            });
    }

    useEffect(() => {
        getGroup()
    }, []);

    function attachToGroup(id) {
        props.api(`/cabinet/group/${group.id}/attach/${id}`)
            .then(() => {
                getGroup()
            })
    }

    function detachFromGroup(id) {
        props.api(`/cabinet/group/${group.id}/detach/${id}`)
            .then(() => {
                getGroup()
            })
    }

    return group.id ? <div>
        <MyBreadCrumb items={[
            {href: '/cabinet', label: t('Cabinet')},
            {href: '/cabinet/groups', label: t('My groups')},
            {label: t('Edit group')},
        ]}/>

        <Form onSubmit={handleSubmit} className={'alert alert-info'}>
            <Row form>
                <Col md={6}>
                    <FormGroup>
                        <Label for={'groupName'}>{t('Name')}</Label>
                        <Input name={'name'} id={'groupName'} invalid={errors.includes('name')} defaultValue={group.name}/>
                        <FormFeedback>{t('Required')}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for={'groupDescription'}>{t('Description')}</Label>
                        <Input name={'description'} id={'groupDescription'} invalid={errors.includes('description')} defaultValue={group.description}/>
                        <FormFeedback>{t('Required')}</FormFeedback>
                    </FormGroup>

                </Col>

            </Row>
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
            {group.user.referrals && group.user.referrals.map((ref, i) => <tr key={i}>
                <td>{ref.referral.first_name}</td>
                <td>{!group.members.map(m => m.id).includes(ref.referral.id) && <Button onClick={() => attachToGroup(ref.referral._id)}><FontAwesomeIcon icon={faArrowRight}/></Button>}</td>
                <td>{group.members.map(m => m.id).includes(ref.referral.id) && <Button onClick={() => detachFromGroup(ref.referral._id)}><FontAwesomeIcon icon={faArrowLeft}/></Button>}</td>
            </tr>)}
            </tbody>
            <tbody>
            <tr>
                <th colSpan={3} className={'text-center'}><small>{t('Parents')}</small></th>
            </tr>
            {group.user.parents && group.user.parents.map((par, j) => <tr key={j}>
                <td>{par.parent.first_name}</td>
                <td>{!group.members.map(m => m.id).includes(par.parent.id) && <Button onClick={() => attachToGroup(par.parent._id)}><FontAwesomeIcon icon={faArrowRight}/></Button>}</td>
                <td>{group.members.map(m => m.id).includes(par.parent.id) && <Button onClick={() => detachFromGroup(par.parent._id)}><FontAwesomeIcon icon={faArrowLeft}/></Button>}</td>
            </tr>)}

            </tbody>
        </table>
    </div> : <Loader/>
}
