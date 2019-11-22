import React, {useEffect, useState} from 'react';
import AccessDenied from "client/service/access-denied";
import {t} from "client/components/Translator"
import MyBreadCrumb from "client/components/MyBreadCrumb";
import {A} from "hookrouter";
import {Nav, NavItem} from "reactstrap";

export default function Cabinet(props) {
    if (!props.authenticatedUser) return <AccessDenied/>;
    const [user, setUser] = useState({});

    useEffect(() => {
        props.api('/cabinet/info')
            .then(u => setUser(u))
    }, []);

    return <div>
        <MyBreadCrumb items={[
            {label: t('Cabinet')},
        ]}/>

        <div className={'row'}>
            <div className={'col'}>
                <Nav vertical>
                    <NavItem className={'mb-2'}>
                        <A href={'/cabinet/link'}>{t('Invitation Link')}</A> - <small>{t('Link with which you can invite users')}</small>
                    </NavItem>

                    <NavItem className={'mb-2'}>
                        <A href={'/cabinet/groups/my'}>{t('My groups')}</A> - <small>{t('Groups where you can include invited users')}</small>
                    </NavItem>

                    <NavItem className={'mb-2'}>
                        <A href={'/cabinet/groups/invited'}>{t('In groups')}</A> - <small>{t('Groups where they invited me')}</small>
                    </NavItem>

                    <NavItem className={'mb-2'}>
                        <A href={'/cabinet/referrals'}>{t('Referrals')}</A> - <small>{t('Those who accepted my invitation')}</small>
                    </NavItem>

                    <NavItem className={'mb-2'}>
                        <A href={'/cabinet/parents'}>{t('Parents')}</A> - <small>{t('Those whose invitation I have used')}</small>
                    </NavItem>

                </Nav>
            </div>
            <div className={'col d-flex justify-content-center align-items-center'}>
                {user.first_name}
                {user.photo_url && <img src={user.photo_url} alt={'user logo'} height={30}/>}
            </div>
        </div>
    </div>

}

