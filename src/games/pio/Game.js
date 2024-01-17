import Controller from '../Controller.js';
import Player from './Player.js';
import Prop from './Prop.js';
import Group from './Group.js';


export default class Game {
    constructor() {
        let board = document.getElementById('game');
        console.log(board.height);
        let canvas = board.getContext('2d');

        let gameFrame = 0;

        let chick = new Player('images/pio/duck.png', 0, 0, board.width / 2, board.height - 20, 30, 20);

        let worms = new Group();
        
        //To add in a Class method but I need to work on the scope
        setInterval(()=>{
            worms.addElement(new Prop('images/pio/worm.png', 0,Math.floor(Math.random() * board.width), 0, 15, 15));
        }, 2000);
        
        
        //set a config file with the keyCode as a string and the call back you want to pass after the event has been triggered
        new Controller({
            'ArrowRight' : chick.moveRight.bind(chick),
            'ArrowLeft' : chick.moveLeft.bind(chick)
        });

        
        function animationEngine() {
            canvas.clearRect(0,0,board.width, board.height);
            //canvas.rotate(Math.PI/2);
            chick.render(canvas);

            if(gameFrame % 3 == 0)
                chick.animateRight();
            //chick.animateJump();
            worms.elements.map(worm => {
                if (worm.noRender) {
                    return
                }
                else {
                    worm.render(canvas);
                    //if (worms.elements[i].position.y + worms.elements[i].dimension.height >= )
                    worm.move();
                    if(gameFrame % 5 == 0){
                        worm.animate();
                    }    
                }
            });

            //collider
            for (let i = 0; i < worms.elements.length; i++) {
                let wormX = worms.elements[i].position.x;
                let chickX = chick.position.x;
                if (
                    ((chickX >= wormX && chickX <= wormX + worms.elements[i].dimension.width) && (worms.elements[i].position.y + worms.elements[i].dimension.height >= chick.position.y)) 
                    || 
                    ((wormX >= chickX && wormX <= chickX + chick.dimension.width) && (worms.elements[i].position.y + worms.elements[i].dimension.height >= chick.position.y))
                    ) {
                    //delete worms.elements[i];
                    worms.elements[i].noRender = true;
                };  
            };

            for (let i = 0; i < worms.elements.length; i++) {
                if(worms.elements[i].position.y + worms.elements[i].dimension.height >= board.height) {
                    worms.elements[i].noRender = true;
                };
            };
            
            gameFrame++;

            requestAnimationFrame(animationEngine);
        };

        animationEngine();
    }
}