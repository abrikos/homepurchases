import React, {useEffect} from "react";

export default function TelegramLogin(props){
    {/*<script async src="https://telegram.org/js/telegram-widget.js?7" data-telegram-login="samplebot" data-size="medium" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
    <script type="text/javascript">
        function onTelegramAuth(user) {
            alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        }
</script>*/}


    const id = 'TelegramLoginButton';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?2';
    script.setAttribute('data-telegram-login', props.botName || 'samplebot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-request-access',  'write');
    script.setAttribute('data-userpic', true);
    script.setAttribute('data-onauth', `${props.onAuth}(user)`);
    script.async = true;

    useEffect(()=>{
        document.getElementById(id).appendChild(script);
    }, [])

    return <div id={id}/>
}