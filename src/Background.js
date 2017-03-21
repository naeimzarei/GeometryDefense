/**
 * Created by naeimzarei on 2/13/17.
 *
 * This class is used as the main component
 * of the GeometryDefense game. It contains
 * nested components, including the central
 * defensive unit (Tower.js) and the game
 * labels (GameLabel.js).
 *
 */
import React, {Component} from "react";
import GameLabel from "./GameLabel";
import Tower from "./Tower";
import Sprite from "./Sprite";
import "./App.css";

export default class Background extends Component {
    constructor() {
        super();
        this.state = {
            style: {}, // CSS of central defensive unit
            laserStyle: {}, // CSS of laser beam
            laserTop: 0, // How much the laser has moved from the top
            laserLeft: 0, // How much the laser has moved to the right
            previousDegree: 0, // the previous degree (interval of 45)
            degree: 0, // previousDegree + degree = newDegree (interval of 45)
            isIntervalOn: false, // prevents stacking of setInterval functions
            CURRENT_TIME: 0.72, // laser beam audio start time (seconds)
            INTERVAL_DURATION_MOVEMENT: 10, // movement animation duration (ms)
            INTERVAL_DURATION_LASER: 5, // laser beam animation duration (ms)
            id: 0, // setInterval id of current animation
            idSprite: 0, // id of last Sprite component inserted in spriteArray
            spriteArray: [], // array containing Sprite components
            spriteObjectArray: []// array containing data about each Sprite component
        };
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    /* Adds focus on the Background component */
    componentDidMount() {
        this.refs.board.focus();
    }
    
    animateSprite() {
        
    }
    
    /* Plays laser beam sound effect
     * at specified audio position
     */
    seekAudio() {
        const self = this;
        if (self.state.isIntervalOn) {
            return;
        }
        setTimeout(function() {
            self.refs.audio.currentTime = self.state.CURRENT_TIME;
            self.refs.audio.play();
        }, 50);
    }
    
    
    /* Keyboard handler for input */
    handleKeyDown(event) {
        event.preventDefault();
        switch (event.which) {
            case 32: // Space bar
                this.seekAudio();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 37: // Left
                this.animateCounterclockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 39: // Right
                this.animateClockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 38: // Up
                this.seekAudio();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 40: // Down
                this.seekAudio();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 65: // A (Left)
                this.animateCounterclockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 68: // D (Right)
                this.animateClockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 83: // S (Down)
                this.seekAudio();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 87: // W (Up)
                this.seekAudio();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            default:
                this.generateSprite();
                break;
        }
    }
    
    /* Checks if rotation is 360 degrees. If
    so, resets the degree back to 0. If not,
    then nothing happens */
    checkRotationLogic(deg) {
        return (Math.abs(deg) === 360);
    }
    
    /* Finds the positive degree equivalency
    of a given degree (positive or negative) */
    findPositiveDegree(deg) {
        if (deg >= 0)
            return deg;
        switch (deg) {
            case 0: return 0;
            case -45: return 315;
            case -90: return 270;
            case -135: return 225;
            case -180: return 180;
            case -225: return 135;
            case -270: return 90;
            case -315: return 45;
            default: return;
        }
    }
    
    /* Laser beam animation */
    animateLaser() {
        const self = this;
        
        if (self.state.isIntervalOn) {
            return;
        }
        
        this.setState({
            id: setInterval(frame, this.state.INTERVAL_DURATION_LASER),
            isIntervalOn: true
        });
        
        function frame() {
            function endFrame() {
                clearInterval(self.state.id);
                self.setState({
                    isIntervalOn: false,
                    laserLeft: 0,
                    laserTop: 0,
                    id: 0
                }, function () {
                    self.setState({
                        laserStyle: {
                            left: "48.5%",
                            top: "45%",
                            visibility: "hidden",
                            transform: self.state.laserStyle.transform
                        }
                    });
                });
            }
            
            switch (self.findPositiveDegree(self.state.previousDegree)) {
                case 0:
                    self.setState({
                        laserTop: self.state.laserTop + 1
                    }, function () {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                top: (45 - self.state.laserTop) + "%"
                            }
                        }, function () {
                            if (self.state.laserTop === 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 45:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.5,
                        laserTop: self.state.laserTop + 1.5
                    }, function() {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (49 + self.state.laserLeft) + "%",
                                top: (45 - self.state.laserTop) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserTop >= 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 90:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1
                    }, function () {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (49 + self.state.laserLeft) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserLeft === 42) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 135:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.5,
                        laserTop: self.state.laserTop + 1.5
                    }, function() {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (49 + self.state.laserLeft) + "%",
                                top: (45 + self.state.laserTop) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserTop >= 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 180:
                    self.setState({
                        laserTop: self.state.laserTop + 1
                    }, function() {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                top: (self.state.laserTop + 45) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function () {
                            if (self.state.laserTop === 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 225:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.5,
                        laserTop: self.state.laserTop + 1.5
                    }, function() {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (49 - self.state.laserLeft) + "%",
                                top: (45 + self.state.laserTop) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserTop >= 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 270:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1
                    }, function () {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (45 - self.state.laserLeft) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserLeft === 37) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 315:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.5,
                        laserTop: self.state.laserTop + 1.5
                    }, function() {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                left: (49 - self.state.laserLeft) + "%",
                                top: (45 - self.state.laserTop) + "%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserTop >= 35) {
                                endFrame();
                            }
                        });
                    });
                    break;
                default:
                    break;
            }
        }
    }
    
    /* Animates the defensive unit clockwise */
    animateClockwise(duration) {
        const self = this;
        /* Prevents stacking of setInterval
        functions */
        if (self.state.isIntervalOn) {
            return;
        }
        /* Starts setInterval function */
        this.setState({
            id: setInterval(frame, duration),
            isIntervalOn: true
        });
        /* Changes rotation frame by frame given
        argument "duration" */
        function frame() {
            if (self.state.degree % 45 === 0 && self.state.degree !== 0) {
                clearInterval(self.state.id);
                self.setState({
                    degree: 0,
                    previousDegree: self.state.previousDegree + 45,
                    id: 0,
                    isIntervalOn: false
                }, function() {
                    if (self.checkRotationLogic(self.state.previousDegree)) {
                        self.setState({
                            previousDegree: 0
                        });
                    }
                });
            } else {
                self.setState({
                    degree: self.state.degree + 5
                }, function() {
                    self.setState({
                        style: {
                            transform: "rotate(" + (self.state.degree + self.state.previousDegree) + "deg)"
                        },
                        laserStyle: {
                            transform: "rotate(" + (self.state.degree + self.state.previousDegree) + "deg)"
                        }
                    });
                });
            }
        }
    }
    
    /* Animates the defensive unit counterclockwise */
    animateCounterclockwise(duration) {
        const self = this;

        if (self.state.isIntervalOn) {
            return;
        }
        
        this.setState({
            id: setInterval(frame, duration),
            isIntervalOn: true
        });

        function frame() {
            if (self.state.degree % 45 === 0 && self.state.degree !== 0) {
                clearInterval(self.state.id);
                self.setState({
                    degree: 0,
                    previousDegree: self.state.previousDegree - 45,
                    id: 0,
                    isIntervalOn: false
                }, function() {
                    if (self.checkRotationLogic(self.state.previousDegree)) {
                        self.setState({
                            previousDegree: 0
                        });
                    }
                });
            } else {
                self.setState({
                    degree: self.state.degree - 5
                }, function() {
                    self.setState({
                        style: {
                            transform: "rotate(" + (self.state.degree + self.state.previousDegree) + "deg)"
                        },
                        laserStyle: {
                            transform: "rotate(" + (self.state.degree + self.state.previousDegree) + "deg)"
                        }
                    });
                });
            }
        }
    }
    
    /* Generates a Sprite and displays it
    on the DOM */
    generateSprite() {
        const self = this;
        
        function getRandomInclusive(min, max) {
            return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
        }
        var randomShape = getRandomInclusive(1, 6);
        var randomColor = getRandomInclusive(1, 3);
        var randomLocation = getRandomInclusive(1, 8);
        
        switch (randomShape) {
            case 1: randomShape="triangle"; break;
            case 2: randomShape="square"; break;
            case 3: randomShape="pentagon"; break;
            case 4: randomShape="heptagon"; break;
            case 5: randomShape="octagon"; break;
            case 6: randomShape="star"; break;
            default: break;
        }
        
        switch (randomColor) {
            case 1: randomColor="black"; break;
            case 2: randomColor="red"; break;
            case 3: randomColor="yellow"; break;
            default: break;
        }
        
        var left;
        var top;
        switch (randomLocation) {
            case 1: left="10%"; top="10%"; break;
            case 2: left="47%"; top="10%"; break;
            case 3: left="86%"; top="10%"; break;
            case 4: left="10%"; top="45%"; break;
            case 5: left="10%"; top="75%"; break;
            case 6: left="47%"; top="75%"; break;
            case 7: left="86%"; top="45%"; break;
            case 8: left="85%"; top="45%"; break;
            default: break;
        }
        
        const spriteStyle = {
            position: "absolute",
            width: "50px",
            height: "50px",
            left: left,
            top: top
        };
        
        var spriteObject = {
            object: <Sprite key={this.state.idSprite}
                            css={"Sprite " + randomLocation}
                            shapeName={randomShape}
                            shapeColor={randomColor}
                            properties={spriteStyle}/>,
            key: this.state.idSprite,
            css: "Sprite " + randomLocation,
            randomColor: randomColor,
            randomShape: randomShape,
            randomLocation: randomLocation,
            properties: spriteStyle
        };
        
        var tempSpriteArray = self.state.spriteArray.slice();
        tempSpriteArray.push(spriteObject);
        
        // TODO
        self.setState({
            spriteArray: tempSpriteArray,
            idSprite: self.state.idSprite + 1
        }, function() {
            var tempSpriteArray = self.state.spriteArray.slice();
            var oldObject = tempSpriteArray[0];
    
            var newProperties = {
                position: "absolute",
                width: "50px",
                height: "50px",
                backgroundColor: "blue"
            };
            var newObject = {
                object: <Sprite key={oldObject.key}
                                css={oldObject.css}
                                shapeName={oldObject.randomShape}
                                shapeColor={oldObject.randomColor}
                                properties={newProperties}/>,
                key: oldObject.key,
                css: oldObject.css,
                randomColor: oldObject.randomColor,
                randomShape: oldObject.randomShape,
                randomLocation: oldObject.randomLocation,
                properties: newProperties
            };
            
            tempSpriteArray[0] = newObject;
            
            self.setState({
                spriteArray: tempSpriteArray
            });
        });
    }
    
    renderSprites() {
        var tempArray = [];
        for (var i = 0; i < this.state.spriteArray.length; i++) {
            tempArray.push(this.state.spriteArray[i].object);
        }
        return tempArray;
    }
    
    render() {
        this.renderSprites();
        return (
            <div className="Background-Container">
                <audio ref="audio" src={require("../sound/laser.mp3")} >
                </audio>
                <GameLabel className="Background-Label-Top" labels={["Score", "Time", "Settings"]} />
                <div ref="board" className="Background" onKeyDown={this.handleKeyDown} tabIndex="0">
                    {this.renderSprites()}
                    <Tower css={this.state.style} towerNumber="3_3"/>
                    <img key="laser" alt="laser" className="Laser"
                         src={require("../sprites/other/laser.png")} style={this.state.laserStyle}/>
                </div>
                <GameLabel css="bottom" labels={["", "Geometric Defense", ""]} />
            </div>
        );
    }
}
