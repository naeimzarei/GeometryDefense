/**
 * Created by naeimzarei on 4/12/17.
 */
import React, {Component} from "react";
import Message from "./Message";

export default class GameMessage extends Component {
    constructor() {
        super();
        this.state = {
            cssInner: {
                position: "relative",
                width: "500px",
                height: "250px",
                backgroundColor: "snow",
                borderRadius: "5px",
                transform: "translateX(50%) translateY(50%)",
                opacity: "0.5"
            },
            cssMessage: {
                position: "absolute",
                fontSize: "28px",
                fontFamily: "Didot",
                wordBreak: "break-word",
                left: "15%",
                top: "25%",
                padding: "25px"
            }
        };
    }
    
    render() {
        return (
            <div style={this.state.cssInner}>
                <Message message={this.props.text} css={this.state.cssMessage} />
            </div>
        );
    }
}