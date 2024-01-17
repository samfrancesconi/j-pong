export default class Player {
    constructor(src,srcx, srcy, x, y, width, height) {
        this.dimension = {
            width: width,
            height: height
        };

        this.position = {
            x : x,
            y : y
        };

        this.sourcex = srcx;

        this.sourcey = srcy;

        this.speed = 2;

        this.image = new Image();
        this.image.src = src;
    }

    render(c) {
        c.drawImage(this.image, this.sourcex , this.sourcey, 500, 500, this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }

    moveRight() {
        if(this.position.x < 300 - this.dimension.width) 
            this.position.x += 5 * this.speed;
    }

    animateRight() {
        if(this.sourcex < 3468) 
        {
            this.sourcex += 578;
        }
        else 
        {
            this.sourcex = 0;
        } 
    }

    animateJump() {}

    moveLeft() {
        if(this.position.x > 5)
            this.position.x -= 5 * this.speed;
    }

}