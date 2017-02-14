# GeometryDefense
An accessible web application game similar to the 
Atari "Asteroids" game.

### Basic Requirements
1. A strong foundation in HTML, CSS, and JavaScript
2. A general understanding of jQuery, React, and JSX
3. Some knowledge of the HTML canvas element
4. A strong knowledge of event handling and error handling
5. A basic understanding of color schemes and graphics design

### Code Design
As mentioned earlier, the game will use the React library
to create the game. For that reason, a general understanding
of the React library is needed. For instance, the React
class methods such as `componentDidMount()` are important
and cannot be left out. In addition, the object-oriented
approach to the React library is a plus since it simplifies
code and pipelines the game creation process. A general
understanding of JSX, an extension to the JavaScript 
language, is also a bonus.

The concept of "game ticks" will be explored in the
code design. A game tick is essentially a specific unit
of time unique to a game. In the case of Geometry Defense,
the game tick will be a value between 0.6 and 0.8 seconds.
Game ticks are needed to determine the order in which 
game events happen. For instance, did the asteroid hit the
tower first, or did the tower shoot the asteroid first? 
Each event will have a constant number of game ticks. 
Whichever event has the least number of game ticks occurs
first. This notion implies that there is a difference 
between what the viewer sees and what actually happens. 
Game ticks resolve this issue by playing the role of a 
"judge" and determining what event fired off first.

In addition to game ticks, the code heavily relies on
collision algorithms to determine if the asteroid has
crashed into the tower. Since the asteroids are different
shapes, different algorithms may be needed to determine
if the object has collided into the tower. The radii and 
or the distance between the tower and asteroid will be 
continuously taken into account. If the distance margin
is between a set range, then there is a collision and thus
the tower is hit.  

The use of animation is a requirement for this project.
Therefore, the jQuery library as well as React's native
animation methods will be used to move the asteroids and
shoot the tower missiles. 

Lastly, since this game deals with a lot of geometry, the 
HTML canvas will be used to create specific shapes. In 
order to get the canvas to work fully functionally, it is
necessary to fine tune the placement and shape of the 
figures on the HTML DOM using JavaScript. 

### External Libraries
1. React.JS: the main JavaScript library that will be used to 
implement the game
2. Artyom.JS: a JavaScript library that recognizes speech
and allows the user to prompt the computer with commands
3. Font Awesome: a CSS library for icons and vibrant fonts

### Graphics Design
Adobe Illustrator will be used to create some basic game
graphics, such as the asteroid vectors as well as the tower
defense system. A sketch of the game dynamics is included
in this repository titled `Geometric-Defense-Design.png`. 
In addition, CSS and other externalJavaScript files may be
used to enhance rendering of objects. 

### Accessibility
The concept of degrees of freedom will be explored in 
Geometric Defense. Degrees of freedom are essentially how 
much input the user is able to make. With lower degrees of 
freedom, the user can do less. With higher degrees, the user
can do more.

For the higher degree of freedom mode, the user has the ability
to move the defense system clockwise and counterclockwise. 

For the lower degreee of freedom mode, the user cannot move
the defense system at all. Rather, they may only fire the 
missiles. The defense system automatically aligns itself
towards the incoming geometrical shapes. 

A possible third intermediate degree of freedom may be made.
This mode would allow the the user to move the defense system
clockwise and counterclockwise, but the missiles are constantly
firing off. So the user would not have to press extra keys. 

Key mappings will be implemented in this project as well. For 
instance, the left and right keys by default move the defense
system clockwise and counterclockwise. With key mappings, the
user may opt to move the defense system using the up or down 
keys. The spacebar by default fires off the missile system.
If the player chooses to move the defense system using the
up and down keys, either the left or right keys may be used
to fire the missiles along with the spacebar. If the player 
chooses to move the defense system using the left and right
keys, then either the up and down keys may be used to fire 
the missiles along with the spacebar. 