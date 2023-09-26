export default class Player {
    constructor(src, x, y, width, height) {
        this.dimension = {
            width: width,
            height: height
        };

        this.position = {
            x : x,
            y : y
        };

        this.speed = 2;

        this.image = new Image();
        this.image.src = src;
    }

    render(c) {
        c.drawImage(this.image, this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }

    moveRight() {
        if(this.position.x < 300 - this.dimension.width) 
            this.position.x += 5 * this.speed;
    }

    moveLeft() {
        if(this.position.x > 5)
            this.position.x -= 5 * this.speed;
    }

}