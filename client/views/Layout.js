import React, {useEffect, useRef, useState} from 'react';
import TopMenu from "client/components/TopMenu";
//import 'bootstrap/dist/css/bootstrap.css';
import 'client/views/style/main.sass';
import 'client/views/style/modal.css';
import {Alert} from "reactstrap";
import {useRoutes} from "hookrouter";
import routes from "client/views/Routes";
import {changeLanguage, t} from "client/components/Translator";
import Loader from "client/components/Loader";


export default function Layout(props) {
    const [isLoading, setLoading] = useState(true)

    let {children, alert, ...rest} = props;

    const menuItems = [
        {label: t('Home'), path: '/'},
        {label: t('Contacts'), path: '/contacts'},
        {label: t('Cabinet'), path: '/cabinet', hidden: !props.authenticatedUser},
        {label: t('Login'), path: '/login', hidden: props.authenticatedUser},
        {label: t('Logout'), onClick: props.logOut, hidden: !props.authenticatedUser},
        {
            label: t('Language'), items: [
                {label: 'RU', onClick: () => changeLanguage('ru')},
                {label: 'EN', onClick: () => changeLanguage('en')},
            ]
        },
    ];
    useEffect(() => {
        props.checkAuth()
            .then(res => {
                setLoading(false)
            })

    }, [isLoading]);


    const routeResult = useRoutes(routes(props));
    const prevRoute = usePrevious(routeResult);
    if(prevRoute && prevRoute.type!==routeResult.type){
        props.clearAlert()
    }


    function usePrevious(value) {
        // The ref object is a generic container whose current property is mutable ...
        // ... and can hold any value, similar to an instance property on a class
        const ref = useRef();

        // Store current value in ref
        useEffect(() => {
            ref.current = value;
        }, [value]); // Only re-run if value changes

        // Return previous value (happens before update in useEffect above)
        return ref.current;
    }

    return <div className={'content main'}>
        <TopMenu {...rest} items={menuItems}/>
        <Alert {...alert}/>

        <div className={'container py-2'}>
            {isLoading ? <Loader/> : routeResult}
        </div>
        <footer>
            {props.isLoading && <Loader/>}
        </footer>
    </div>

}


