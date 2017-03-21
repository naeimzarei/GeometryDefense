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
    constructor(props) {
        super(props);
        this.state = {messagesArray: []};
    }
    
    componentDidMount() {
        var tempArray = this.state.messagesArray.slice();
        for (var i = 0; i < this.props.labels.length; i++) {
            tempArray.push(<Message key={i} message={this.props.labels[i]}/>);
        }
        this.setState({
            messagesArray: tempArray
        });
    }
    
    render() {
        return (
            <div className={ (this.props.css === "bottom") ? "GameLabel-Bottom" : "GameLabel"}>
                {this.state.messagesArray}
            </div>
        );
    }
}