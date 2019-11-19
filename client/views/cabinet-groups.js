import {Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export default function CabinetGroups(props) {
    const [groupsList, setGroupsList] = useState();
    const [errors, setErrors] = useState([]);

    function createGroup(form) {
        props.api('/cabinet/group/create', form)
            .then(group => {
                getGroupsList()
            })
    }

    function handleSubmit(e) {
        e.preventDefault();
        const array = Array.from(e.target.elements).filter(f => !!f.name)
        //.map(f=>{ return {name:f.name, value:f.value}; })
        const form = {};
        for (const a of array) {
            form[a.name] = a.value
            if(a.name==='name' && !a.value) errors.push(a.name)
        }
        if(errors.length) return getGroupsList();
        //console.log(form)
        createGroup(form);
        e.target.reset();
    }

    useEffect(() => {
        getGroupsList()
    }, [errors])

    function getGroupsList() {
        props.api(`/cabinet/tab/group`)
            .then(res => {
                let content;
                if (res.error) return;

                content = <table className={'table'}>
                    <tbody>
                    <tr>
                        <th>{t('Name')}</th>
                        <th>{t('Date')}</th>
                    </tr>
                    {res.map(group => <tr key={group.id}>
                        <td><Input defaultValue={group.name} onChange={e=>groupChange(group.id,'name',e.target.value)}/></td>
                        <td>{group.updated}</td>
                        {/*<td><Button><FontAwesomeIcon icon={faCheck} size={'xs'}/></Button></td>*/}
                    </tr>)}
                    </tbody>
                </table>
                setGroupsList(content)
            })
    }

    function groupChange(id, field, value){
        props.api('/cabinet/group/update/'+id, {field,value})
    }

    return <div>
        <Form onSubmit={handleSubmit} className={'alert alert-info m-2'}>
            <Row form>
                <Col md={6}>
                    <FormGroup>
                        <Label for={'groupName'}>{t('Name')}</Label>
                        <Input name={'name'} id={'groupName'} invalid={errors.includes('name')}/>
                        <FormFeedback>{t('Required')}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md={6}>


                </Col>

            </Row>
            <Button>{t('Create new group')}</Button>
        </Form>
        {groupsList}
    </div>
}