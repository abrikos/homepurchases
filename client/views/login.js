import React, {useEffect, useState} from 'react';
import {A, useRoutes} from "hookrouter";
import logo from "client/images/logo.png";
import {Button} from "reactstrap";
import {t} from "client/components/Translator";
import TelegramLogin from "client/components/TelegramLogin";
import GoogleLogin from 'react-google-login';

export default function Login(props) {

    const [botName, setBotName] = useState('');

    const handleTelegramResponse = async response => {
        const res = await props.apiData('/login/telegram', response);
        if (res.error) return;
        props.logIn();
    };

    const testLogin = async response => {
        const res = await props.apiData('/login/test', response);
        if (res.error) return;
        props.logIn();
    };

    useEffect(() => {
        props.apiData('/bot-name')
            .then(res => setBotName(res.botName))
    }, []);

    const responseGoogle = (response) => {
        console.log(response);
    }

    return <div>
        <A href={'/cabinet'}>CAB</A>
        <div className={'d-flex justify-content-center'}>
            <div className={'card'}>
                <div className={'card-header'}>{t('Log in')}</div>
                <div className={'card-body'}>

                    <Button onClick={() => props.logIn('test')}>Test</Button>

                    {/*<TelegramLogin onAuth={()=>props.logIn('telegram)} botName={botName}/>*/}

                    {/*<GoogleLogin
                        clientId="986859169011-5ia10srbpfgt71ig1sh33aiv3l961un3.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />*/}
                </div>

            </div>
        </div>


    </div>


}


