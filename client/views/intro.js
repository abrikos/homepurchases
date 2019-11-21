import React from 'react';
import {t} from "client/components/Translator"
import TelegramLogin from "client/components/TelegramLogin";

export default function Intro(props) {
    return <div>
        {t('To use the system, please log in using Telegram.')}
        <TelegramLogin {...props}/>
    </div>

}


