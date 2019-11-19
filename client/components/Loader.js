import React, {Component} from 'react';
//import loader from 'client/images/loader.gif'

export default class Loader extends Component {
    render(){
        return <img src={'/images/loader.gif'} alt={'loading...'} width={30}/>
    }
}