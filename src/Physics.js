/**
 * Class representing the physics system, using Matter.js for physics simulation.
 */
export class Physics{
    /**
    * Creates a new Physics object and initializes the Matter.js engine and world.
    * 
    * @param {object} p - The p5.js instance.
    */
   constructor(p){
       this.p=p;
       this.engine = Matter.Engine.create();
       this.world=this.engine.world;
       this.runner = Matter.Runner.create();
       Matter.Runner.run(this.runner, this.engine);
       //Matter.Engine.run(this.engine);
   }

   /**
    * Adds a physics body to the world.
    * 
    * @param {Matter.Body} body - The Matter.js body to add to the physics world.
    */
   addBody(body){
       Matter.Composite.add(this.world, body);
       //Matter.World.add(this.world, body);
   }

   /**
    * Registers a callback function to be triggered when a collision occurs in the physics engine.
    * 
    * @param {Function} callback - The function to call when a collision starts. The callback receives an event object with collision details.
    */
   onCollision(callback){
       Matter.Events.on(this.engine, 'collisionStart', callback);
   }

   /**
    * Updates the position of a specific physics body.
    * 
    * @param {Matter.Body} body - The Matter.js body to update.
    * @param {number} newX - The new x-coordinate for the body.
    * @param {number} newY - The new y-coordinate for the body.
    */
   updatePosition(body, newX, newY) {
       Matter.Body.setPosition(body, {x: newX, y: newY});
   }

   /**
    * Clears all bodies from the physics world without resetting the engine.
    */
   clearBody() {
       Matter.World.clear(this.world, false);
   } 
}