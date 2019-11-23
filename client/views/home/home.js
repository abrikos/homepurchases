import React, {useEffect, useState} from 'react';
import Intro from "client/views/intro";
import {Button, Form, Input} from "reactstrap";
import {t} from "client/components/Translator"
import GroupsSelect from "client/views/home/groups-select";
import PurchaseEdit from "client/views/home/purchase-edit";
import PurchasesSelect from "client/views/home/purchases-select";
import {A} from "hookrouter";

export default function Home(props) {
    if (!props.authenticatedUser) return <Intro {...props}/>;
    const [purchase, setPurchase] = useState();
    const [group, setGroup] = useState();
    const [groups, setGroups] = useState();
    const [noGroups, setNoGroups] = useState(false);

    useEffect(getGroups, []);

    function getGroups() {
        props.api('/group/list/user')
            .then(res => {
                setGroups(res);
                if (props.purchaseId) {
                    return findPurchase(props.purchaseId);
                }

                let groupFound;
                const index = res.my.map(g => g.id).indexOf(props.authenticatedUser.group);
                const index2 = res.invited.map(g => g.id).indexOf(props.authenticatedUser.group);
                if (index >= 0) {
                    groupFound = res.my[index]
                } else if (index2 >= 0) {
                    groupFound = res.invited[index2]
                } else if (res.my.length) {
                    groupFound = res.my[0]
                } else if (res.invited.length) {
                    groupFound = res.invited[0]
                }

                if (groupFound) {
                    setGroup(groupFound)
                    setPurchase(groupFound.purchases[0])
                } else {
                    setNoGroups(true)
                }
                //if (g.purchases[0]) setPurchase(g.purchases[0])
            });
    }

    function getGroup(gid) {
        props.api(`/group/${gid}/view`)
            .then(setGroup)
    }

    function createPurchase() {
        props.api(`/group/${group.id}/purchase/create`)
            .then(p => findPurchase(p.id))
    }

    function findPurchase(value) {
        props.api(`/purchase/${value}`)
            .then(p => {

                getGroup(p.group.id)
                setPurchase(p)
            })
    }


    function sendMessage(e) {
        e.preventDefault();

        props.api(`/group/${group.id}/message`, {text: e.target.elements.text.value})
        e.target.reset()
    }

    return <div>
        {noGroups && <A href={''}>{t('No groups found. Go to create own group')}</A>}

        {group && <div>
            <GroupsSelect onChange={getGroup} groups={groups} default={group} {...props}/>
            {!!group.purchases.length && <div>
                <PurchasesSelect onChangeSelectPurchase={findPurchase} default={purchase} group={group} {...props}/>
                <hr/>
                <PurchaseEdit purchase={purchase} onChangePurchase={setPurchase} {...props}/>
            </div>}
            <div className={'row'}>
                <div className={'col text-right'}><Button onClick={createPurchase} size={'sm'}>{t('Create new purchase in group')}</Button></div>
                <div className={'col text-left'}> {group.name}</div>
            </div>
            <hr/>
            <div><A href={`/cabinet/group/${group.id}/edit`}> {t('Edit group')} {group.name}</A></div>
            <div>{t('Group members')}: {group.owner.first_name}; {group.members.map(m => m.first_name).join('; ')} </div>
            <Form onSubmit={sendMessage}>
                <Input name={'text'}/>
                <Button>{t('Send message to members')}</Button>
            </Form>

        </div>}

    </div>;
}




