/**
 * Created by naeimzarei on 2/13/17.
 */
import React, {Component} from "react";
import GameLabel from "./GameLabel";
import "./App.css";

export default class Background extends Component {
    render() {
        return (
            <div className="Background">
                <GameLabel className="Background-Label-Top" labels={["Score", "Time", "Settings"]} />
                <GameLabel css="bottom" labels={["", "Geometric Defense", ""]} />
            </div>
        );
    }
}
