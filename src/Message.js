/**
 * Created by naeimzarei on 2/13/17.
 */
import React, {Component} from "react";

export default class Message extends Component {
    render() {
        return (
            <li className="Message">{this.props.message}</li>
        );
    }
}