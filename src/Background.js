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
require("../node_modules/howler/dist/howler.min.js");
require("../node_modules/artyom.js/build-vanilla/artyom.min");
import React, {Component} from "react";
import GameLabel from "./GameLabel";
import GameMessage from "./GameMessage";
import Tower from "./Tower";
import Sprite from "./Sprite";
import "./App.css";

export default class Background extends Component {
    constructor() {
        super();
        this.state = {
            style: {}, // CSS of central defensive unit
            backgroundCSS: { // CSS of Background div
                position: "fixed",
                backgroundColor: "#233237",
                width: "1000px",
                height: "500px",
                margin: "0 auto",
                borderRadius: "10px"
            },
            laserStyle: {}, // CSS of laser beam
            laserTop: 0, // How much the laser has moved from the top
            laserLeft: 0, // How much the laser has moved to the right
            towerNumber: "3_3", // the Tower's health
            score: 0, // the game score
            time: 0, // the game timer
            previousDegree: 0, // the previous degree (interval of 45)
            degree: 0, // previousDegree + degree = newDegree (interval of 45)
            isIntervalOn: false, // prevents stacking of setInterval functions
            hasStatedCompassDirection: false, // whether or not direction has been stated
            CURRENT_TIME: 720, // laser beam audio start time (seconds)
            INTERVAL_DURATION_MOVEMENT: 10, // movement animation duration (ms)
            INTERVAL_DURATION_LASER: 1, // laser beam animation duration (ms)
            INTERVAL_DURATION_SPRITE: 300, // sprite animation duration (ms) (1200)
            INTERVAL_DURATION_SPRITE_SPAWN: 1000, // the rate at which Sprites spawn (ms)
            SPEECH_SYNTHESIS_DELAY: 250, // delay before speechSynthesis library loads (250)
            LASER_OFFSET: 5, // the laser offset value
            TOWER_OFFSET: 8, // the tower offset value
            APPROACHING_TOWER_OFFSET: 40, // how close a Sprite has to be to be considered "approaching"
            id: 0, // setInterval id of current animation
            idSprite: 0, // id of last Sprite component inserted in spriteArray
            idMessage: 0, // id of last GameMessage component inserted in gameMessageArray
            idSpawn: 0, // id of interval that spawns Sprite components
            idTime: 0, // id of interval that updates the timer
            spriteArray: [], // array containing Sprite components
            gameMessageArray: [ // array containing GameMessage components
                <GameMessage key={-1} text="Press any key to begin" />
            ]
        };
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.Artyom = window.artyom;
    }
    
    /**
     * Adds focus on the Background component
     * during start up.
     */
    componentDidMount() {
        const self = this;
        self.refs.board.focus();
        self.blurBackground();
        
        setTimeout(function() {
            self.Artyom.initialize({
                lang: "en-US",
                debug: false,
                continuous: false,
                listen: false,
                speed: 0.85,
                volume: 0.3
            });
    
            self.Artyom.say("Press any key to begin!");
        }, self.state.SPEECH_SYNTHESIS_DELAY);
    }
    
    /**
     * Keyboard handler for input
     * @param {Event} event
     */
    handleKeyDown(event) {
        event.preventDefault();
        
        if (this.state.gameMessageArray[0] !== undefined) {
            const key = parseInt(this.state.gameMessageArray[0].key, 10);
            if (key === -1 || key === -2) {
                this.startGame();
                return;
            }
        }
        
        switch (event.which) {
            case 32: // Space bar
                this.playLaser();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 37: // Left
                this.animateCounterclockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 39: // Right
                this.animateClockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 38: // Up
                this.playLaser();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 40: // Down
                this.playLaser();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 65: // A (Left)
                this.animateCounterclockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 68: // D (Right)
                this.animateClockwise(this.state.INTERVAL_DURATION_MOVEMENT);
                break;
            case 83: // S (Down)
                this.playLaser();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            case 87: // W (Up)
                this.playLaser();
                this.animateLaser(this.state.INTERVAL_DURATION_LASER);
                break;
            default:
                break;
        }
    }
    
    /**
     * Starts the game
     */
    startGame() {
        const self = this;
        self.refs.board.focus();
        self.Artyom.shutUp();
        self.unblurBackground();
        self.removeGameMessage(-1);
        self.removeGameMessage(-2);
        self.generateSprite();
        self.startSpriteSpawnInterval();
    }
    
    /**
     * Ends the game
     */
    endGame() {
        const self = this;
        clearInterval(self.state.idSpawn);
        clearInterval(self.state.idTime);
        for (var i = 0; i < self.state.spriteArray.length; i++) {
            clearInterval(self.state.spriteArray[i].intervalID);
        }
        self.setState({
            spriteArray: []
        });
        self.resetStateVariables();
        self.setState({
            gameMessageArray: [<GameMessage key={-2} text="Game over. Press any key to play again."/>]
        });
        self.blurBackground();
        self.Artyom.say("Game over. Press any key to play again!");
    }
    
    /**
     * Resets all state variables back
     * to what they started off as
     */
    resetStateVariables() {
        const self = this;
        self.setState({
            style: {},
            backgroundCSS: {
                position: "fixed",
                backgroundColor: "#233237",
                width: "1000px",
                height: "500px",
                margin: "0 auto",
                borderRadius: "10px"
            },
            laserStyle: {},
            laserTop: 0,
            laserLeft: 0,
            towerNumber: "3_3",
            score: 0,
            time: 0,
            previousDegree: 0,
            degree: 0,
            isIntervalOn: false,
            hasStatedCompassDirection: false,
            CURRENT_TIME: self.state.CURRENT_TIME,
            INTERVAL_DURATION_MOVEMENT: self.state.INTERVAL_DURATION_MOVEMENT,
            INTERVAL_DURATION_LASER: self.state.INTERVAL_DURATION_LASER,
            INTERVAL_DURATION_SPRITE: self.state.INTERVAL_DURATION_SPRITE,
            INTERVAL_DURATION_SPRITE_SPAWN: self.state.INTERVAL_DURATION_SPRITE_SPAWN,
            LASER_OFFSET: self.state.LASER_OFFSET,
            TOWER_OFFSET: self.state.TOWER_OFFSET,
            SPEECH_SYNTHESIS_DELAY: self.state.SPEECH_SYNTHESIS_DELAY,
            APPROACHING_TOWER_OFFSET: self.state.APPROACHING_TOWER_OFFSET,
            id: 0,
            idSprite: 0,
            idMessage: 0,
            idSpawn: 0,
            idTime: 0,
            spriteArray: [],
            gameMessageArray: []
        });
    }
    
    /**
     * Plays the laser beam sound effect
     * at specified audio position stored
     */
    playLaser() {
        const self = this;
        if (self.state.isIntervalOn) {
            return;
        }
        var sound = new window.Howl({
            src: [require("../sound/laser.mp3")],
            volume: 0.3,
            sprite: {
                laser: [self.state.CURRENT_TIME, 850]
            }
        });
    
        setTimeout(function() {
            sound.play("laser");
        }, 50);
    }
    
    /**
     *
     * @param {Number} min
     * @param {Number} max
     * @return {Number} randomNum
     */
    getRandomInclusive(min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    }
    
    /**
     * Checks if rotation is 360 degrees. If so,
     * resets the tower degree back to 0. If not,
     * nothing happens.
     * @param {Number} deg
     * @return {Boolean}
     */
    checkRotationLogic(deg) {
        return (Math.abs(deg) === 360);
    }
    
    /**
     * Finds the positive degree equivalency
     * of a given degree (positive or negative)
     * @param {Number} deg
     * @return {Number} positiveDegree
     */
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
    
    /**
     * Clones the Sprite object with the
     * specified key value
     * @param {Number} key
     * @return {Object}
     */
    getSprite(key) {
        var tempSpriteArray = this.state.spriteArray.slice();
        for (var i = 0; i < tempSpriteArray.length; i++) {
            if (tempSpriteArray[i].key === key) {
                return tempSpriteArray[i];
            }
        }
        return null;
    }
    
    /**
     * Clones the state array containing
     * the Sprite objects
     * @return {Array}
     */
    getSpriteArray() { return this.state.spriteArray.slice(); }
    
    /**
     * Finds the Sprite's index in
     * the Sprite array given the specified
     * key
     * @param {Number} key
     * @return {Number} index
     */
    getSpriteIndex(key) {
        for (var i = 0; i < this.state.spriteArray.length; i++) {
            if (this.state.spriteArray[i].key === key) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Given a key, gets the Coordinate
     * location of the Sprite component
     * @param {Number} key
     * @return {Object} Coordinate
     */
    getSpriteCoordinates(key) {
        const self = this;
        const tempObject = self.getSprite(key);
        return {
            x: parseInt(tempObject.properties.left, 10),
            y: parseInt(tempObject.properties.top, 10)
        };
    }
    
    /**
     * Returns the Coordinate location of
     * the laser
     * @return {Object} Coordinate
     */
    getLaserCoordinates() {
        const self = this;
        return {
            x: parseInt(self.state.laserStyle.left, 10),
            y: parseInt(self.state.laserStyle.top, 10)
        };
    }
    
    /**
     * Given a Sprite key, checks whether or not
     * the laser has collided into a Sprite
     * @param {Number} key
     * @return {Boolean}
     */
    hasLaserCollided(key) {
        const self = this;
        const laserCoordinate = self.getLaserCoordinates();
        const spriteCoordinate = self.getSpriteCoordinates(key);
        
        const RANGE = {
            x1: laserCoordinate.x - self.state.LASER_OFFSET,
            x2: laserCoordinate.x + self.state.LASER_OFFSET,
            y1: laserCoordinate.y - self.state.LASER_OFFSET,
            y2: laserCoordinate.y + self.state.LASER_OFFSET
        };
    
        return (spriteCoordinate.x >= RANGE.x1 && spriteCoordinate.x <= RANGE.x2) &&
            (spriteCoordinate.y >= RANGE.y1 && spriteCoordinate.y <= RANGE.y2);
    }
    
    /**
     * Given a Sprite key, checks whether or not
     * the Tower has collided into a Sprite
     * @param {Number} key
     * @return {Boolean}
     */
    hasTowerCollided(key) {
        const self = this;
        const spriteCoordinate = self.getSpriteCoordinates(key);
        
        const RANGE = {
            x1: 45 - self.state.TOWER_OFFSET,
            x2: 45 + self.state.TOWER_OFFSET,
            y1: 40 - self.state.TOWER_OFFSET,
            y2: 40 + self.state.TOWER_OFFSET
        };
        
        return (spriteCoordinate.x >= RANGE.x1 && spriteCoordinate.x <= RANGE.x2) &&
            (spriteCoordinate.y >= RANGE.y1 && spriteCoordinate.y <= RANGE.y2);
    }
    
    /**
     * Given a Sprite key, checks whether or not
     * a Sprite is approaching the Tower
     * @param {Number} key
     * @return {Boolean}
     */
    isSpriteApproaching(key) {
        const self = this;
        const spriteObject = self.getSprite(key);
        const spriteCoordinate = self.getSpriteCoordinates(key);
        const spriteArray = self.getSpriteArray();
        
        if (typeof spriteArray[0] === "undefined") { return false; }
        if (self.getSpriteIndex(key) === -1) { return false; }
        if ((spriteObject.key <= spriteArray[0].key) === false) { return false; }
        
        const RANGE = {
            x1: 45 - self.state.APPROACHING_TOWER_OFFSET,
            x2: 45 + self.state.APPROACHING_TOWER_OFFSET,
            y1: 40 - self.state.APPROACHING_TOWER_OFFSET,
            y2: 40 + self.state.APPROACHING_TOWER_OFFSET
        };
        
        return (spriteCoordinate.x >= RANGE.x1 && spriteCoordinate.x <= RANGE.x2) &&
            (spriteCoordinate.y >= RANGE.y1 && spriteCoordinate.y <= RANGE.y2);
    }
    
    /**
     * Given a key, finds the higher level
     * location of the Sprite component on
     * initial rendering
     * @param {Number} key
     * @return {String} HigherLevelLocation
     */
    getHigherLevelSpriteLocation(key) {
        const self = this;
        const Coordinate = self.getSpriteCoordinates(key);
        if (Coordinate.x === 0 && Coordinate.y === 0) {
            return "Top-Left";
        } else if (Coordinate.x === 45 && Coordinate.y === 0) {
            return "Top-Center";
        } else if (Coordinate.x === 95 && Coordinate.y === 0) {
            return "Top-Right";
        } else if (Coordinate.x === 0 && Coordinate.y === 45) {
            return "Center-Left";
        } else if (Coordinate.x === 95 && Coordinate.y === 45) {
            return "Center-Right";
        } else if (Coordinate.x === 0 && Coordinate.y === 90) {
            return "Bottom-Left";
        } else if (Coordinate.x === 45 && Coordinate.y === 90) {
            return "Bottom-Center";
        } else if (Coordinate.x === 95 && Coordinate.y === 90) {
            return "Bottom-Right";
        }
        return "Unknown";
    }
    
    /**
     * Clones the state variable
     * gameMessageArray
     * @return {Array} gameMessageArray
     */
    getMessageArray() {
        const self = this;
        return self.state.gameMessageArray.slice();
    }
    
    /**
     * Adds a GameMessage component to state
     * variable
     * @param {String} message
     */
    addGameMessage(message) {
        const self = this;
        
        var gameMessageArray = self.getMessageArray();
        const gameMessage = <GameMessage text={message} key={self.state.idMessage + 1}/>;
        
        gameMessageArray.push(gameMessage);
        self.setState({
            idMessage: self.state.idMessage + 1,
            gameMessageArray: gameMessageArray
        }, function() {
            self.blurBackground();
        });
    }
    
    /**
     * Given a key, removes a particular
     * GameMessage component
     * @param {Number} key
     */
    removeGameMessage(key) {
        const self = this;
        var gameMessageArray = self.getMessageArray();
        for (var i = 0; i < gameMessageArray.length; i++) {
            if (parseInt(gameMessageArray[i].key, 10) === key) {
                gameMessageArray.splice(i, 1);
                self.setState({gameMessageArray: gameMessageArray});
                return;
            }
        }
    }
    
    /**
     * Removes all GameMessage components
     * from the DOM
     */
    removeAllGameMessages() {
        const self = this;
        self.setState({
            gameMessageArray: []
        });
    }
    
    /**
     * Blurs the background
     */
    blurBackground() {
        const self = this;
        const newBackgroundCSS = {
            position: "fixed",
            backgroundColor: "#233237",
            width: "1000px",
            height: "500px",
            margin: "0 auto",
            borderRadius: "10px",
            filter: "blur(15px)"
        };
        self.setState({
            backgroundCSS: newBackgroundCSS
        });
    }
    
    /**
     * Un-blurs the background
     */
    unblurBackground() {
        const self = this;
        const newBackgroundCSS = {
            position: "fixed",
            backgroundColor: "#233237",
            width: "1000px",
            height: "500px",
            margin: "0 auto",
            borderRadius: "10px"
        };
        self.setState({
            backgroundCSS: newBackgroundCSS
        });
    }
    
    /**
     * Returns a new style object, given
     * the Sprite's key value, left and
     * top values
     * @param {Number} key
     * @param {Number} left
     * @param {Number} top
     * @return {Object} newStyle
     */
    animateSpriteHelper(key, left, top) {
        const self = this;
        return {
            position: "absolute",
            width: "50px",
            height: "50px",
            left: (self.getSpriteCoordinates(key).x + left) + "%",
            top: (self.getSpriteCoordinates(key).y + top) + "%"
        };
    }
    
    /**
     * Animates a Sprite component given
     * a key value
     * @param {Number} key
     */
    animateSprite(key) {
        const self = this;
        
        const spriteObject = self.getSprite(key);
        var spriteArray = self.getSpriteArray();
        const higherLevelLocation = self.getHigherLevelSpriteLocation(key);
    
        var newSpriteObject = {
            intervalID: setInterval(frame, self.state.INTERVAL_DURATION_SPRITE),
            object: <Sprite key={spriteObject.key}
                            css={"Sprite " + spriteObject.randomLocation}
                            shapeName={spriteObject.randomShape}
                            shapeColor={spriteObject.randomColor}
                            properties={spriteObject.properties}/>,
            key: spriteObject.key,
            css: "Sprite " + spriteObject.randomLocation,
            randomColor: spriteObject.randomColor,
            randomShape: spriteObject.randomShape,
            randomLocation: spriteObject.randomLocation,
            properties: spriteObject.properties
        };
        
        spriteArray.splice(self.getSpriteIndex(key), 1);
        spriteArray.push(newSpriteObject);
        
        self.setState({
            spriteArray: spriteArray,
            idSprite: self.state.idSprite + 1
        });
        
        function frame() {
            const oldSpriteObject = self.getSprite(key);
            var spriteArray = self.getSpriteArray();
            
            if (oldSpriteObject === undefined) return;
    
            function endFrame() {
                clearInterval(oldSpriteObject.intervalID);
                spriteArray.splice(self.getSpriteIndex(key), 1);
                self.setState({
                    spriteArray: spriteArray,
                    hasStatedCompassDirection: false
                });
            }
            
            if (self.state.hasStatedCompassDirection === false) {
                if (self.isSpriteApproaching(key)) {
                    var compassDirection = "";
                    switch (higherLevelLocation) {
                        case "Top-Left": compassDirection = "Northwest"; break;
                        case "Top-Center": compassDirection = "North"; break;
                        case "Top-Right": compassDirection = "Northeast"; break;
                        case "Center-Left": compassDirection = "West"; break;
                        case "Center-Right": compassDirection = "East"; break;
                        case "Bottom-Left": compassDirection = "Southwest"; break;
                        case "Bottom-Center": compassDirection = "South"; break;
                        case "Bottom-Right": compassDirection = "Southeast"; break;
                        default: break;
                    }
        
                    self.setState({hasStatedCompassDirection: true});
                    self.Artyom.say(compassDirection);
                }
            }
            
            if (self.hasTowerCollided(key)) {
                var newValue;
                switch (self.state.towerNumber) {
                    case "3_3":
                        newValue = "2_3";
                        break;
                    case "2_3":
                        newValue = "1_3";
                        break;
                    case "1_3":
                        newValue = "0_3";
                        self.setState({
                            towerNumber: newValue
                        }, function() {
                            self.endGame();
                        });
                        return;
                    default:
                        break;
                }
                self.setState({
                    towerNumber: newValue
                });
                endFrame();
                return;
            }
            
            switch (higherLevelLocation) {
                case "Top-Left":
                    var newStyle = self.animateSpriteHelper(key, 1, 1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: self.animateSpriteHelper(key, 1, 1)
                    };
                    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Top-Center":
                    var newStyle = self.animateSpriteHelper(key, 0, 1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Top-Right":
                    var newStyle = self.animateSpriteHelper(key, -1, 1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Center-Left":
                    var newStyle = self.animateSpriteHelper(key, 1, 0);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Center-Right":
                    var newStyle = self.animateSpriteHelper(key, -1, 0);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Bottom-Left":
                    var newStyle = self.animateSpriteHelper(key, 1, -1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Bottom-Center":
                    var newStyle = self.animateSpriteHelper(key, 0, -1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                case "Bottom-Right":
                    var newStyle = self.animateSpriteHelper(key, -1, -1);
                    var newSpriteObject = {
                        intervalID: oldSpriteObject.intervalID,
                        object: <Sprite key={oldSpriteObject.key}
                                        css={"Sprite " + oldSpriteObject.randomLocation}
                                        shapeName={oldSpriteObject.randomShape}
                                        shapeColor={oldSpriteObject.randomColor}
                                        properties={newStyle}/>,
                        key: oldSpriteObject.key,
                        css: "Sprite " + oldSpriteObject.randomShape,
                        randomColor: oldSpriteObject.randomColor,
                        randomShape: oldSpriteObject.randomShape,
                        randomLocation: oldSpriteObject.randomLocation,
                        properties: newStyle
                    };
    
                    spriteArray.splice(self.getSpriteIndex(key), 1);
                    spriteArray.push(newSpriteObject);
                    self.setState({spriteArray: spriteArray});
                    break;
                default:
                    break;
            }
        }
    }
    
    /**
     * Animates the laser beam
     */
    animateLaser() {
        const self = this;
        
        if (self.state.isIntervalOn) {
            return;
        }
        
        this.setState({
            id: setInterval(frame, self.state.INTERVAL_DURATION_LASER),
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
            
            var spriteArray = self.getSpriteArray();
            for (var i = 0; i < spriteArray.length; i++) {
                if (self.hasLaserCollided(spriteArray[i].key)) {
                    clearInterval(spriteArray[i].intervalID);
                    spriteArray.splice(self.getSpriteIndex(spriteArray[i].key), 1);
                    self.setState({
                        spriteArray: spriteArray,
                        score: self.state.score + 10,
                        hasStatedCompassDirection: false
                    }, function() {
                        endFrame();
                    });
                    return;
                }
            }
            
            switch (self.findPositiveDegree(self.state.previousDegree)) {
                case 0:
                    self.setState({
                        laserTop: self.state.laserTop + 1
                    }, function () {
                        self.setState({
                            laserStyle: {
                                visibility: "visible",
                                top: (45 - self.state.laserTop) + "%",
                                left: "48.5%"
                            }
                        }, function () {
                            if (self.state.laserTop === 45) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 45:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.7,
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
                            if (self.state.laserTop >= 40) {
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
                                top: "45%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserLeft === 50) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 135:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.7,
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
                            if (self.state.laserTop >= 40) {
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
                                left: "48.5%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function () {
                            if (self.state.laserTop === 45) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 225:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.7,
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
                            if (self.state.laserTop >= 40) {
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
                                top: "45%",
                                transform: self.state.laserStyle.transform
                            }
                        }, function() {
                            if (self.state.laserLeft === 45) {
                                endFrame();
                            }
                        });
                    });
                    break;
                case 315:
                    self.setState({
                        laserLeft: self.state.laserLeft + 1.7,
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
                            if (self.state.laserTop >= 40) {
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
    
    /**
     * Animates the defense unit clockwise
     * @param {Number} duration
     */
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
    
    /**
     * Animates the defensive unit counterclockwise
     * @param {Number} duration
     */
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
    
    /**
     *  Generates a Sprite and displays it
     *  on the DOM
     */
    generateSprite() {
        const self = this;
        
        var randomShape = self.getRandomInclusive(1, 6);
        var randomColor = self.getRandomInclusive(1, 3);
        var randomLocation = self.getRandomInclusive(1, 8);
        
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
            case 1: left="0%"; top="0%"; break;
            case 2: left="45%"; top="0%"; break;
            case 3: left="95%"; top="0%"; break;
            case 4: left="0%"; top="45%"; break;
            case 5: left="0%"; top="90%"; break;
            case 6: left="45%"; top="90%"; break;
            case 7: left="95%"; top="45%"; break;
            case 8: left="95%"; top="90%"; break;
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
            intervalID: null,
            object: <Sprite key={self.state.idSprite}
                            css={"Sprite " + randomLocation}
                            shapeName={randomShape}
                            shapeColor={randomColor}
                            properties={spriteStyle}/>,
            key: self.state.idSprite,
            css: "Sprite " + randomLocation,
            randomColor: randomColor,
            randomShape: randomShape,
            randomLocation: randomLocation,
            properties: spriteStyle
        };
        
        var tempSpriteArray = self.getSpriteArray();
        tempSpriteArray.push(spriteObject);
        
        self.setState({
            spriteArray: tempSpriteArray
        }, function() {
            self.animateSprite(spriteObject.key);
        });
    }
    
    /**
     * Starts the interval rate at which
     * the Spawns generate. Also starts
     * the interval for the game timer.
     */
    startSpriteSpawnInterval() {
        const self = this;
        
        self.setState({
            idSpawn: setInterval(spawnSprite, self.state.INTERVAL_DURATION_SPRITE_SPAWN),
            idTime: setInterval(updateTime, 1000)
        });
        
        function spawnSprite() {
            self.generateSprite();
        }
        
        function updateTime() {
            self.setState({time: self.state.time + 1});
        }
    }
    
    /**
     *  Renders the sprite objects on the DOM
     *  in the render function
     */
    renderSprites() {
        var tempArray = [];
        for (var i = 0; i < this.state.spriteArray.length; i++) {
            tempArray.push(this.state.spriteArray[i].object);
        }
        return tempArray;
    }
    
    /**
     * Given how many digits places,
     * converts the input to the
     * hundreds place
     * @param {Number} input
     * @param {Number} digits
     * @return {String} output
     */
    convertInteger(input, digits) {
        if (input >= 999) { return "999" }
        return input.toLocaleString("en-US", {minimumIntegerDigits: digits});
    }
    
    /**
     * Renders elements to the DOM
     */
    render() {
        this.renderSprites();
        return (
            <div className="Background-Container">
                <audio ref="audio" src={require("../sound/laser.mp3")} />
                <GameLabel labels={[this.convertInteger(this.state.score, 3), this.convertInteger(this.state.time, 3), "Settings"]} />
                <div ref="board" style={this.state.backgroundCSS} onKeyDown={this.handleKeyDown} tabIndex="0">
                    {this.renderSprites()}
                    <Tower css={this.state.style} towerNumber={this.state.towerNumber}/>
                    <img key="laser" alt="laser" className="Laser"
                         src={require("../sprites/other/laser.png")}
                         style={this.state.laserStyle}/>
                </div>
                {this.state.gameMessageArray}
                <GameLabel css="bottom" labels={["", "Geometric Defense", ""]} />
            </div>
        );
    }
}
