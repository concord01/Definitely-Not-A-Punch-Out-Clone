// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});
action_check = true;
// This section will be to load assets
loadSprite("playerChar", "https://kaboomjs.com/sprites/gigagantrum.png");
loadSpriteAtlas("player.png", {
        "player": {
            x: 8, // X-coordinate of the top-left corner of the first frame
            y: 0, // Y-coordinate of the top-left corner of the first frame
            width: 64, // Width of the entire sprite sheet
            height: 160, // Height of the entire sprite sheet
            sliceX: 2, // Number of columns in the sprite sheet
            sliceY: 5, // Number of rows in the sprite sheet
            anims: {
                "punch": {
                    from: 2, // Starting frame index for this animation
                    to: 4, // Ending frame index for this animation
                    speed: 20, // Animation speed (frames per second)
                    loop: false, // Whether the animation should loop
                },
                // Add more animations as needed
                "idle": {
                    from: 0,
                    to: 1,
                    speed: 3,
                    loop: true,
                }
            },
        },
        // Add more sprite definitions if your sheet contains multiple distinct sprites
    });

// Custom Code
function enemy_attack(owner){
    destroyed = false;
    onDestroy((owner) => {
        destroyed = true;
    })
    wait(3, () => {
        loop(1, () => {
        if (destroyed){
            return;
        }
        else{
        add([
        rect(5,15),
        pos(250,50),
        area(),
        move(90,1200),
        ])
    }
    })
    })
};
function player_attack(owner){
    add([
        rect(30,30),
        color(0,0,0),
        pos(owner.x,owner.y),
        area(),
        move(180,-1200),
        "player_punch"
    ])
};
// Main game scene
scene("main",(level) => {

    //player creation
    const player = add([
        sprite("player", {anim: "idle"}),
        scale(5),
        pos(center().x-32, 400),
        area({ scale: 0.7 }),
        timer(),
        "player",
        hittable = true,
    ]);

    //Making an enemy
    const enemy = add([
    rect(40, 40),
    pos(center().x, 80),
    color(255, 0, 0), // Red color
    area(),
    anchor("center"),
    health(5),
    enemy_attack(player),
    "enemy",
    ]);
    // Player controls
    
    onKeyPress("left", () => { player.move(-1200, 0); hittable = false; wait(0.5, () => {player.move(1200,0)}); hittable = true;});
    onKeyPress("right", () => { player.move(1200, 0); hittable = false; wait(0.5, () => {player.move(-1200,0)}); hittable = true;});
    onKeyPress("down", () => { player.move(0, 1200); hittable = false; wait(0.5, () => {player.move(0,-1200)}); hittable = true;});
    onKeyPress("z", () => {
        if(action_check){
            action_check = false;
            player.play("punch");
            player.move(0,-800); 
            wait(0.1,() => player_attack(player)); 
            wait(0.2,() => player.play("idle"), player.move(0,800));
            action_check = true;
        }
        else{
            return
        }
    })
    
    enemy.on("death", () => {
        destroy(enemy)
    })

    player.onCollide(() => {
        if(hittable){
            destroy(player)
        }
        else{
            return
        }
    })
})


go("main")