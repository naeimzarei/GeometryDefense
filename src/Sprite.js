/**
 * Created by naeimzarei on 2/15/17.
 *
 * This class is used to render a sprite component,
 * which will represent the incoming objects that
 * the central defensive unit must destroy. This class
 * randomly picks a sprite and sprite color and renders
 * it to to the display.
 *
 */

import React, {Component} from "react"

export default class Sprite extends Component {
    selectSprite() {
        if (this.props.shapeName === "triangle") {
            return <img alt={this.props.shapeColor + " triangle"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/triangle/" + this.props.shapeColor + " triangle.png")}
                        style={this.props.properties}/>;
        } else if (this.props.shapeName === "square") {
            return <img alt={this.props.shapeColor + " square"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/square/" + this.props.shapeColor + " square.png")}
                        style={this.props.properties}/>;
        } else if (this.props.shapeName === "pentagon") {
            return <img alt={this.props.shapeColor + " pentagon"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/pentagon/" + this.props.shapeColor + " pentagon.png")}
                        style={this.props.properties}/>;
        } else if (this.props.shapeName === "heptagon") {
            return <img alt={this.props.shapeColor + " heptagon"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/heptagon/" + this.props.shapeColor + " heptagon.png")}
                        style={this.props.properties}/>;
        } else if (this.props.shapeName === "octagon") {
            return <img alt={this.props.shapeColor + " octagon"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/octagon/" + this.props.shapeColor + " octagon.png")}
                        style={this.props.properties}/>;
        } else {
            return <img alt={this.props.shapeColor + " star"} className={this.props.css}
                        key={this.props.id}
                        src={require("../sprites/shapes/star/" + this.props.shapeColor + " star.png")}
                        style={this.props.properties}/>;
        }
    }
    
    render() {
        return (
            this.selectSprite()
        );
    }
}