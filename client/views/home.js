import React, {useEffect, useReducer, useState} from 'react';
import Intro from "client/views/intro";
import {Button} from "reactstrap";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {t} from "client/components/Translator"
import HomeGroupsSelect from "client/views/home-groups-select";
import PurchaseEdit from "client/views/purchase/purchase-edit";
import Loader from "client/components/Loader";
import HomePurchasesSelect from "client/views/home-purchases-select";
import {A} from "hookrouter";

export default function Home(props) {
    if (!props.authenticatedUser) return <Intro {...props}/>;
    const [group, setGroup] = useState();
    const [purchase, setPurchase] = useState();

    useEffect(() => {
        if (props.authenticatedUser.group) getGroup(props.authenticatedUser.group)
    }, [])


    function modal(props) {
        return <div className="modal fade" id="settingsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel4" aria-hidden="true">
            <div className="modal-dialog modal-dialog-slideout modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{t('Settings')}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">


                    </div>
                    {/*<div className="modal-footer">
                        <Button className="btn-sm" data-dismiss="modal"></Button>

                    </div>*/}
                </div>
            </div>
        </div>
    }

    function getGroup(gid) {
        props.api(`/group/${gid}/view`)
            .then(g => {
                setGroup(g)
                console.log(g)
                if (g.purchases[0]) setPurchase(g.purchases[0])
            })
    }

    function createPurchase() {
        props.api(`/group/${group.id}/purchase/create`)
            .then(g => setGroup(g))
    }

    function findPurchase(selected) {
        props.api(`/purchase/${selected.value}`)
            .then(setPurchase)
    }

    return <div>
        {/*<Button data-toggle="modal" data-target="#settingsModal" className={'btn-sm float-right'}>
            <FontAwesomeIcon icon={faCog}/>
        </Button>
        {modal(props)}*/}
        <HomeGroupsSelect onChange={getGroup} {...props}/>
        {group && <div>

            {!!group.purchases.length && <div>
                <HomePurchasesSelect onChangeSelectPurchase={findPurchase} purchase={purchase} group={group} {...props}/>
                <PurchaseEdit purchase={purchase} onChangePurchase={setPurchase} {...props}/>
            </div>}
            <Button onClick={createPurchase} size={'sm'}>{t('Create new purchase in this group')}</Button>
            <div>{t('Members')}: {group.members.map(m => <span key={m.id}>{m.first_name}</span>)}</div>
            {group.test}
            <div><A href={`/cabinet/group/${group.id}/edit`}> {t('Edit group')}</A></div>
        </div>}

    </div>;
}




