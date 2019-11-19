import React, {useEffect, useState} from 'react';
import TopMenu from "client/components/TopMenu";
import 'bootstrap/dist/css/bootstrap.css';
import 'client/views/main.sass';
import {Alert} from "reactstrap";
import {A, useRoutes} from "hookrouter";
import routes from "client/views/Routes";
import {t, changeLanguage} from "client/components/Translator";
import Loader from "client/components/Loader";

export default function Layout(props) {
    const [isLoading, setLoading] = useState(true)

    let {children, alert, ...rest} = props;

    const menuItems = [
        {label: t('Home'), path: '/'},
        {label: t('Contacts'), path: '/contacts'},
        {label: t('Cabinet'), path: '/cabinet', hidden: !props.isAuth},
        {label: t('Login'), path: '/login', hidden: props.isAuth},
        {label: t('Logout'), onClick: props.logOut, hidden: !props.isAuth},
        {
            label: t('Language'), items: [
                {label: 'RU', onClick: () => changeLanguage('ru')},
                {label: 'EN', onClick: () => changeLanguage('en')},
            ]
        },
    ];
    useEffect(()=>{
        props.checkAuth()
            .then(res=>{
                setLoading(false)
            })
    },[isLoading]);

    const routeResult = useRoutes(routes(props));
    console.log(props.isAuth)

    return <div className={'content main'}>
        <TopMenu {...rest} items={menuItems}/>
        <Alert {...alert}/>
        <div className={'container'}>
            {isLoading ? <Loader/> : routeResult}
        </div>
        <footer>

        </footer>
    </div>

}


