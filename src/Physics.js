class Physics{
    constructor(){
        this.engine = Matter.Engine.create();
        this.world=this.engine.world;
        Matter.Engine.run(this.engine);
    }

    addBody(body){
        Matter.World.add(this.world, body);
    }

    onCollision(callback){
        Matter.Events.on(this.engine, 'collisionStart', callback);
    }

    updatePosition(body, newX, newY)
    {
        Matter.Body.setPosition(body, {x: newX, y: newY});
    }

    clearBody()
    {
        Matter.World.clear(this.world, false);
    }
    
}

window.Physics = Physics;