import React, {useEffect} from 'react';
import AccessDenied from "client/views/access-denied";
import {t} from "client/components/Translator"
import CabinetGroups from "client/views/cabinet-groups";

export default function Cabinet(props) {

    const active = 'group';
    const tabs = {
        group: {label: t('Groups'), path: 'group', content: CabinetGroups(props)},
        link: {label: t('Invite link'), path: 'link', content: 'LLLLLLLLL'},
    };
    tabs[active].active = true;


    function getTabContent(tab) {

    }

    function switchTab(event) {
        getTabContent(tabs[event.target.id])
    }

    useEffect(() => {
        getTabContent(tabs[active])
    }, []);

    return props.isAuth ? <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                {Object.keys(tabs).map(id => <li className="nav-item" key={id}>
                    <a className={`nav-link ${!!tabs[id].active && 'active'}`} id={id} data-toggle="tab" href={`#ref-${id}`} role="tab" aria-controls={`ref-${id}`} aria-selected="true" onClick={switchTab}>{tabs[id].label}</a>
                </li>)}


            </ul>
            <div className="tab-content container" id="myTabContent">
                {Object.keys(tabs).map(id => <div className={`tab-pane fade ${!!tabs[id].active && 'show active'}`} id={'ref-' + id} role="tabpanel" aria-labelledby={'ref-' + id} key={id}>{tabs[id].content}</div>)}
            </div>
        </div>
        : <AccessDenied/>

}

