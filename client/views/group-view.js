import React, {useEffect, useState} from "react";
import {t} from "client/components/Translator"
import {A} from "hookrouter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt, faEye, faGopuram, faLink} from "@fortawesome/free-solid-svg-icons";

export default function GroupView(props) {
    const [group, setGroup] = useState();
    useEffect(() => {
        props.api(`/group/${props.id}/view`).then(setGroup)
    }, [])

    if (!group) return <div/>
    return <div>
        <h1>{group.name}</h1>
        <h3>{t('Purchases')}</h3>
        <table className={'table table-striped'}>
            <thead className="bg-dark text-light">
            <tr>
                <th>{t('Name')}</th>
                <th>{t('Total')}</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr><th className="text-center" colSpan={3}>{t('Open')}</th></tr>
            {group.purchases.filter(p=>!p.closed).map((p, i) => <tr key={i}>
                <td>{p.name}</td>
                <td>{p.sum}</td>
                <td><A href={`/purchase/${p.id}`}><FontAwesomeIcon icon={faEye} size={'xs'}/></A></td>
            </tr>)}
            </tbody>
            <tbody>
            <tr><th className={'text-center'} colSpan={3}>{t('Closed')}</th></tr>
            {group.purchases.filter(p=>p.closed).map((p, i) => <tr key={i}>
                <td>{p.name}</td>
                <td>{p.sum}</td>
                <td><A href={`/purchase/${p.id}`}><FontAwesomeIcon icon={faEye} size={'xs'}/></A></td>
            </tr>)}
            </tbody>
        </table>
    </div>
}
