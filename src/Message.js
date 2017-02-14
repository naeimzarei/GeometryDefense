/**
 * Created by naeimzarei on 2/13/17.
 */
import React, {Component} from "react";

export default class Message extends Component {
    render() {
        return (
            <h2>{this.props.message}</h2>
        );
    }
}