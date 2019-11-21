import {Popover, PopoverHeader} from "reactstrap";
import {t} from "client/components/Translator";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import AccessDenied from "client/views/access-denied";
import MyBreadCrumb from "client/components/MyBreadCrumb";

export default function CabinetLink(props) {
    if(!props.authenticatedUser) return <AccessDenied/>;
    const [link,setLink] = useState('empty');
    const [showPop,setShowPop] = useState(false);

    useEffect(()=>{
        props.api('/cabinet/link')
            .then(l=>setLink(l))
    },[])

    function copyToClipboard  (text)  {
        setShowPop(true)
        const textField = document.createElement('textarea')
        textField.innerText = text
        document.body.appendChild(textField)
        textField.select();
        document.execCommand('copy')
        textField.remove();
        setTimeout(() => {
            setShowPop(false)
        }, 2000);
    }

    const id = 'link-copy-btn'
    return <div>
        <MyBreadCrumb items={[
            {href:'/cabinet', label:t('Cabinet')},
            {label:t('Invitation Link')},
        ]}/>
        <code>{link}</code>{' '}
        <span>
            <FontAwesomeIcon icon={faCopy}
                             onClick={e => copyToClipboard(link)}
                             title={`Press to copy: ${link}`}
                             style={{cursor: 'pointer', color: '#555'}} id={id}/>
            <Popover placement={'right'}
                     isOpen={showPop}
                     target={id}
                     >
          <PopoverHeader>{t('Copied')}</PopoverHeader>
        </Popover>
        </span>
    </div>
}
