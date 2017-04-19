/**
 * Created by naeimzarei on 2/13/17.
 *
 * This class is used to embed a message within
 * the GameLabel component.
 *
 */
import React, {Component} from "react";

export default class Message extends Component {
    render() {
        return (
            <span style={this.props.css}>{this.props.message} </span>
        );
    }
}