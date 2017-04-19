/**
 * Created by naeimzarei on 2/13/17.
 *
 * This class is used to create
 * GameLabels, which are components used
 * as labels. For instance, GameLabels are
 * used to change game settings, see the game
 * timer, see the game score, etc.
 *
 */
import React, {Component} from "react";
import Message from "./Message";

export default class GameLabel extends Component {
    render() {
        return (
            <div className={ (this.props.css === "bottom") ? "GameLabel GameLabel-Bottom" : "GameLabel"}>
                <Message key={0} message={this.props.labels[0]} />
                <Message key={1} message={this.props.labels[1]} />
                <Message key={2} message={this.props.labels[2]} />
            </div>
        );
    }
}