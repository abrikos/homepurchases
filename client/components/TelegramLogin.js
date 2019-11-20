import React, {useEffect} from "react";

export default function TelegramLogin(props){
    {/*<script async src="https://telegram.org/js/telegram-widget.js?7" data-telegram-login="samplebot" data-size="medium" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
    <script type="text/javascript">
        function onTelegramAuth(user) {
            alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
        }
</script>*/}
    const id = 'TelegramLoginButton';

    useEffect(()=>{
        props.api('/site-name')
            .then(res=>{
                const script = document.createElement('script');
                //script.src = 'https://telegram.org/js/telegram-widget.js?2';
                script.src = 'https://tg.dev/js/telegram-widget.js?3';
                script.setAttribute('data-telegram-login', props.botName);
                script.setAttribute('data-size', 'medium');
                script.setAttribute('data-request-access',  'write');
                script.setAttribute('data-userpic', true);
                //script.setAttribute('data-onauth', `telegramAuth(user)`);
                script.setAttribute('data-auth-url', `${res.site}/api/login/telegram`);
                script.async = true;
                document.getElementById(id).appendChild(script);
            })

    }, []);

    function telegramAuth(user) {
        console.log(user)
    }

    return <div id={id} >
        {/*<iframe src={`https://oauth.tg.dev/embed/${props.botName}?origin=http://buy.abrikos.com&size=large&userpic=false&request_access=read`} width={238} height={40} frameBorder={0}/>*/}
    </div>
}
