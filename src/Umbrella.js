/**
 * Class representing an umbrella in the sketch, which interacts with physics and can change its color and pitch.
 */
export class Umbrella{
    /**
    * Creates a new Umbrella object.
    * 
    * @param {object} p - The p5.js instance.
    * @param {number} x - The x-coordinate of the umbrella.
    * @param {number} y - The y-coordinate of the umbrella.
    * @param {number} width - The width of the umbrella.
    * @param {number} height - The height of the umbrella.
    * @param {number} noteIndex - The musical note index associated with the umbrella.
    * @param {object} physics - The physics engine used to manage the umbrella's body in the physics world.
    */
   constructor(p, x, y, width, height, noteIndex, physics){
       this.p = p;
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

   /**
    * Draws the umbrella on the canvas, including its handle and canopy.
    */
   draw(){
       this.p.stroke(this.handleColor);
       this.p.strokeWeight(10);
       this.p.line(this.x, this.y+this.height/2, this.x, this.y + +this.height/2+this.handleLength );

       this.p.fill(this.color); 
       this.p.noStroke();
       this.p.triangle(
           this.x - this.width / 2, this.y+this.height/2,
           this.x + this.width / 2, this.y+this.height/2,
           this.x, this.y-this.height/2
       );

   }

   /**
    * Sets the color of the umbrella's canopy.
    * 
    * @param {string} newColor - The new color to apply to the umbrella's canopy.
    */
   setColor(newColor) {
       this.color = newColor;
   }

   /**
    * Sets the restitution (bounciness) of the umbrella's body.
    * 
    * @param {number} newRestitution - The new restitution value.
    */
   setRestitution(newRestitution) {
       Matter.Body.set(this.body, { restitution: newRestitution });
   }

   /**
    * Toggles the color and restitution of the umbrella in a sequence.
    * The umbrella changes through a set of predefined colors and corresponding restitution values.
    */
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

   /**
    * Updates the position of the umbrella in the physics world.
    * 
    * @param {number} newX - The new x-coordinate of the umbrella.
    * @param {number} newY - The new y-coordinate of the umbrella.
    */
   updatePosition(newX, newY) {
       this.x=newX;
       this.y=newY;
       this.physics.updatePosition(this.body, newX, newY);
   }

   /**
    * Updates the size (width and height) of the umbrella.
    * 
    * @param {number} width - The new width of the umbrella.
    * @param {number} height - The new height of the umbrella.
    */
   updateSize(width, height) {
       this.width = width;
       this.height = height;
   }

   /**
    * Adjusts the pitch (semitone) of the umbrella's associated musical note.
    * Handles pitch adjustments based on the umbrella's note index and modifies its handle color and position.
    */
   adjustSemitone() {
       if(this.noteIndex==0 || this.noteIndex==5) {
           if(this.adjustPitch==0) {
               this.adjustPitch=1;
               this.body.adjustPitch=1;
               this.handleColor='#7BB30B';
               this.handleLength=this.handleLength+20;
               this.updatePosition(this.x, this.y-20);
           } else {
               this.adjustPitch=0;
               this.body.adjustPitch=0;
               this.handleColor='#C2F0AF';
               this.updatePosition(this.x, this.y+20);
           }
       } else if (this.noteIndex ==4 || this.noteIndex == 11) {
           if(this.adjustPitch == 0) {
               this.adjustPitch = -1;
               this.body.adjustPitch=-1;
               this.handleColor='#7BB30B';
               this.updatePosition(this.x, this.y+20);
           } else {
               this.adjustPitch=0;
               this.body.adjustPitch=0;
               this.handleColor='#C2F0AF';
               this.updatePosition(this.x, this.y-20);
           }
       } else {
           if(this.adjustPitch == 0) {
               this.adjustPitch = 1;
               this.body.adjustPitch=1;
               this.handleColor='#7BB30B';
               this.handleLength=this.handleLength+20;
               this.updatePosition(this.x, this.y-20);
           } else if(this.adjustPitch == 1) {
               this.adjustPitch = -1;
               this.body.adjustPitch=-1;
               this.updatePosition(this.x, this.y+40);
           } else {
               this.adjustPitch = 0;
               this.body.adjustPitch=0;
               this.handleColor='#C2F0AF';
               this.updatePosition(this.x, this.y-20);
           }
       }
   }
}