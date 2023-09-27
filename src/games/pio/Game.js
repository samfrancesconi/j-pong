import Controller from '../Controller.js';
import Player from './Player.js';
import Prop from './Prop.js';
import Group from './Group.js';


export default function game() {
            let board = document.getElementById('game');
            console.log(board.height);
            let canvas = board.getContext('2d');

            let chick = new Player('images/pio/duck.png', board.width / 2, board.height - 20, 30, 20);
            let worms = new Group();
            
            //To add in a Class method but I need to work on the scope
            setInterval(()=>{
                worms.addElement(new Prop('images/pio/worm.png', Math.floor(Math.random() * board.width), 0, 15, 15));
            }, 15000);
            
            
            //set a config file with the keyCode as a string and the call back you want to pass after the event has been triggered
            new Controller({
                'ArrowRight' : chick.moveRight.bind(chick),
                'ArrowLeft' : chick.moveLeft.bind(chick)
            });

            
            function animationEngine() {
                canvas.clearRect(0,0,board.width, board.height);
                chick.render(canvas);
                worms.elements.map(worm => {
                    worm.render(canvas);
                    //if (worms.elements[i].position.y + worms.elements[i].dimension.height >= )
                    worm.move();
                });

                //collider
                for (let i = 0; i < worms.elements.length; i++) {
                    let wormX = worms.elements[i].position.x;
                    let chickX = chick.position.x;
                    if (((chickX >= wormX && chickX <= wormX + worms.elements[i].dimension.width) && (worms.elements[i].position.y + worms.elements[i].dimension.height >= chick.position.y)) || ((wormX >= chickX && wormX <= chickX + chick.dimension.width) && (worms.elements[i].position.y + worms.elements[i].dimension.height >= chick.position.y))) {
                        //delete worms.elements[i];
                        console.log('collided');
                    }  
                }
                
                requestAnimationFrame(animationEngine);
            };

            animationEngine();
}