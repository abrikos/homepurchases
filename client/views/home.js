import React, {useEffect, useState} from 'react';
import Intro from "client/views/intro";
import {Button} from "reactstrap";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {t} from "client/components/Translator"
import HomeGroups from "client/views/home-groups";
import PurchaseEdit from "client/views/purchase-edit";
import Loader from "client/components/Loader";

export default function Home(props) {
    if (!props.authenticatedUser) return <Intro {...props}/>;
    const [purchase, setPurchase] = useState();


    function modal(props) {
        return <div className="modal fade" id="settingsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel4" aria-hidden="true">
            <div className="modal-dialog modal-dialog-slideout modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{t('Settings')}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">


                        
                    </div>
                    {/*<div className="modal-footer">
                        <Button className="btn-sm" data-dismiss="modal"></Button>

                    </div>*/}
                </div>
            </div>
        </div>
    }

    return <div>
        <Button data-toggle="modal" data-target="#settingsModal" className={'btn-sm float-right'}>
            <FontAwesomeIcon icon={faCog}/>
        </Button>
        {modal(props)}
        <HomeGroups {...props}/>
        {purchase && <PurchaseEdit purchase={purchase} {...props}/>}

    </div>;
}




