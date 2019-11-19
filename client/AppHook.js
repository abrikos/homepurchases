import React, {useEffect, useState} from "react";
import Layout from "client/views/Layout";
import API from "client/API";
import {navigate} from "hookrouter";


export default function App() {
    const [alert, setAlert] = useState({isOpen: false});
    const [isAuth, setAuth] = useState(false)
    const params = {
        isAuth,
        alert,
        setAlert: (response) => {
            const color = response.error ? 'danger' : 'success';
            setAlert({isOpen: true, children: response.message, color})
        },

        clearAlert: () => {
            setAlert({isOpen: false})
        },

        async apiData(path, data) {
            const res = await API.postData(path, data);
            if (!res.error) return res;
            this.clearAlert();
            switch (res.error) {
                case 401:
                    //console.error('FETCH ERROR', path);
                    break;
                default:
                    this.setAlert(res);
            }
            return res;
        },

        async checkAuth() {
            const res = await API.postData('/isAuth');
            if (!res.error) setAuth(true);
        },

        logOut: () => {
            API.postData('/logout')
                .then(res => {
                    if (res.ok) setAuth(false);
                    navigate('/login');
                })
        },

        logIn: (strategy) => {
            API.postData('/login/' + strategy)
                .then(res => {
                    if (res.error) return;
                    if (res.ok) setAuth(true);
                    navigate('/cabinet');

                });
        },
    };


    return (
        <div className="App">
            <Layout {...params}/>
        </div>
    );
}
