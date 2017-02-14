/**
 * Created by naeimzarei on 2/13/17.
 */
import React, {Component} from "react";
import Message from "./Message";

export default class GameLabel extends Component {
    render() {
        return (
            <Message message={this.props.message}/>
        );
    }
}