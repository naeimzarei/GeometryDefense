/**
 * Created by naeimzarei on 2/14/17.
 *
 * This class is used to render the central
 * defensive unit to the display. The Tower
 * component comes in three flavors: 0/3,
 * 1/3, 2/3, and 3/3. The 3/3 form means
 * it is at 100% health. The 0/3 means
 * it is at 0% health. As soon as the unit
 * is hit by a sprite, the tower changes form
 * to accommodate the loss of health.
 *
 */
import React, {Component} from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Tower extends Component {
    selectTower() {
        const towerNumber = this.props.towerNumber;
        if (towerNumber === "3_3") {
            return <img key="3_3" alt="3_3" className="Tower"
                        src={require("../sprites/tower/Tower 3_3.png")}
                        style={this.props.css}/>;
        } else if (towerNumber === "2_3") {
            return <img key="2_3" alt="2_3" className="Tower"
                        src={require("../sprites/tower/Tower 2_3.png")}
                        style={this.props.css}/>;
        } else if (towerNumber === "1_3") {
            return <img key="1_3" alt="1_3" className="Tower"
                        src={require("../sprites/tower/Tower 0_3.png")}
                        style={this.props.css}/>;
        }
        return <img key="0_3" alt="0_3" className="Tower"
                    src={require("../sprites/tower/Tower 0_3.png")}
                    style={this.props.css}/>;
    }
    
    render() {
        return (
            <div>
                <ReactCSSTransitionGroup transitionName="example"
                                         transitionAppear={true}
                                         transitionAppearTimeout={500}
                                         transitionEnter={false}
                                         transitionLeave={false}>
                    {this.selectTower()}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}