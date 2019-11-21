import React, {useEffect, useState} from "react";
import {t} from "client/components/Translator";
import {Button} from "reactstrap";
import {faCog, faUser, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function HomeGroups(props) {
    const [groups, setGroups] = useState({my: [], invited: []});

    useEffect(() => {
        getGroups();
    }, []);

    function getGroups() {
        props.api('/cabinet/group/list')
            .then(res => setGroups(res))
    }

    function setDefaultGroup(group) {
        props.api('/cabinet/user/update/default-group', group)
            .then(() => getGroups())
    }

    const allGroups = groups.my.map(g => {
        g.type = 'my';
        return g;
    }).concat(groups.invited.map(g => {
        g.type = 'invited';
        return g;
    }));
    return <div>
        <strong>{t('Click a group to display by default')}:</strong>
        {allGroups.map((g, i) => <Button className={`d-inline-block m-1 btn-sm btn-info`} style={{textDecoration:groups.default === g.id && 'underline wavy blue'}} disabled={groups.default === g.id} onClick={() => setDefaultGroup(g)} key={i}>
            {g.name} <FontAwesomeIcon icon={g.type === 'my' ? faUser : faUserFriends} size={'xs'}/>
        </Button>)}
    </div>
}
