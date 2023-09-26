import Controller from '../Controller.js';
import Player from './Player.js';
import Prop from './Prop.js';
import Group from './Group.js';


export default function game() {
    //return {
    //    start : () => {
            let board = document.getElementById('game');
            let canvas = board.getContext('2d');

            let pulcino = new Player('images/pio/duck.png', board.width / 2, board.height - 20, 30, 20);
            let worms = new Group();
            
            //To add in a Class method but I need to work on the scope
            setInterval(()=>{
                worms.addElement(new Prop('images/pio/worm.png', Math.floor(Math.random() * board.width), 0, 15, 15));
            }, 2000);
            
            
            //set a config file with the keyCode as a string and the call back you want to pass after the event has been triggered
            new Controller({
                'ArrowRight' : pulcino.moveRight.bind(pulcino),
                'ArrowLeft' : pulcino.moveLeft.bind(pulcino)
            });

            
            function animationEngine() {
                canvas.clearRect(0,0,board.width, board.height);
                pulcino.render(canvas);
                worms.elements.map(worm => {
                    worm.render(canvas);
                    worm.move();
                });
                
                requestAnimationFrame(animationEngine);
            };

            animationEngine();
        //}
    //}
}