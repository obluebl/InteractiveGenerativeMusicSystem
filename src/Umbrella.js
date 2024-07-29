class Umbrella{
    constructor(x,y, width, height, noteIndex, physics){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.noteIndex = noteIndex;
        this.color = '#FBF188'; 
        this.physics = physics;
        this.adjustPitch =0;
        this.handleColor='#C2F0AF';
        this.handleLength=this.height/2;

        let vertices =[
            {x: this.x-this.width/2, y:this.y+this.height/2},
            {x: this.x+this.width/2, y:this.y+this.height/2},
            {x: this.x, y:this.y-this.height/2},
        ];

        this.body = Matter.Bodies.fromVertices(this.x, this.y, vertices,{
            isStatic: true,
            restitution: 0,
        },true);

        this.body.noteIndex = this.noteIndex;
        this.body.adjustPitch = this.adjustPitch;
        this.physics.addBody(this.body);
    }

    draw(){
        stroke(this.handleColor);
        strokeWeight(10);
        line(this.x, this.y+this.height/2, this.x, this.y + +this.height/2+this.handleLength );

        fill(this.color); 
        noStroke();
        triangle(
            this.x - this.width / 2, this.y+this.height/2,
            this.x + this.width / 2, this.y+this.height/2,
            this.x, this.y-this.height/2
        );

    }

    setColor(newColor) {
        this.color = newColor;
    }

    setRestitution(newRestitution) {
        Matter.Body.set(this.body, { restitution: newRestitution });
    }

    toggleColorAndRestitution() {
        if (this.color === '#FBF188') {  
            this.setColor('#FAD26B');  
            this.setRestitution(1.5);
        } else if (this.color === '#FAD26B') {  
            this.setColor('#FBC846'); 
            this.setRestitution(1.7);
        } else if (this.color === '#FBC846') {  
            this.setColor('#FFA615');
            this.setRestitution(2);
        } else if (this.color === '#FFA615') {  
            this.setColor('#FBF188'); 
            this.setRestitution(0);
        }
    }

    updatePosition(newX, newY)
    {
        this.x=newX;
        this.y=newY;
        this.physics.updatePosition(this.body, newX, newY);
    }

    updateSize(width, height)
    {
        this.width = width;
        this.height = height;
    }

    adjustSemitone()
    {
        if(this.noteIndex==0 || this.noteIndex==5)
        {
            if(this.adjustPitch==0)
            {
                this.adjustPitch=1;
                this.body.adjustPitch=1;
                this.handleColor='#7BB30B';
                this.handleLength=this.handleLength+20;
                this.updatePosition(this.x, this.y-20);
            }
            else
            {
                this.adjustPitch=0;
                this.body.adjustPitch=0;
                this.handleColor='#C2F0AF';
                this.updatePosition(this.x, this.y+20);
            }
        }
        else if(this.noteIndex ==4 || this.noteIndex == 11)
        {
            if(this.adjustPitch == 0)
            {
                this.adjustPitch = -1;
                this.body.adjustPitch=-1;
                this.handleColor='#7BB30B';
                this.updatePosition(this.x, this.y+20);
            }
            else
            {
                this.adjustPitch=0;
                this.body.adjustPitch=0;
                this.handleColor='#C2F0AF';
                this.updatePosition(this.x, this.y-20);
            }
        }
        else
        {
            if(this.adjustPitch == 0)
            {
                this.adjustPitch = 1;
                this.body.adjustPitch=1;
                this.handleColor='#7BB30B';
                this.handleLength=this.handleLength+20;
                this.updatePosition(this.x, this.y-20);
            }
            else if(this.adjustPitch == 1)
            {
                this.adjustPitch = -1;
                this.body.adjustPitch=-1;
                this.updatePosition(this.x, this.y+40);
            }
            else
            {
                this.adjustPitch = 0;
                this.body.adjustPitch=0;
                this.handleColor='#C2F0AF';
                this.updatePosition(this.x, this.y-20);
            }
        }
    }
}

window.Umbrella = Umbrella;