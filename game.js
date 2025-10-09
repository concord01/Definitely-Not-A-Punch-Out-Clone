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
            x: 0, // X-coordinate of the top-left corner of the first frame
            y: 0, // Y-coordinate of the top-left corner of the first frame
            width: 64, // Width of the entire sprite sheet
            height: 160, // Height of the entire sprite sheet
            sliceX: 2, // Number of columns in the sprite sheet
            sliceY: 5, // Number of rows in the sprite sheet
            anims: {
                "punch": {
                    from: 3, // Starting frame index for this animation
                    to: 5, // Ending frame index for this animation
                    speed: 20, // Animation speed (frames per second)
                    loop: false, // Whether the animation should loop
                },
                // Add more animations as needed
                "idle": {
                    from: 0,
                    to: 1,
                    speed: 3,
                    loop: true,
                },
                "hurt": {
                    from: 8,
                    to: 9,
                    speed: 10,
                    loop: true,
                },
                "dodge_left": {
                    from: 6,
                    to: 6,
                    speed: 1,
                    loop: true,
                },
                "dodge_right": {
                    from: 7,
                    to: 7,
                    speed: 1,
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
        anchor("center"),
        "enemy_punch"
        ])
    }
    })
    })
};
function player_attack(owner){
    add([
        rect(30,30),
        color(0,0,0),
        pos(240,400),
        area(),
        anchor("center"),
        move(90,-1200),
        "player_punch"
    ])
};
// Main game scene
scene("main",(level) => {

    //player creation
    const player = add([
        sprite("player", {anim: "idle"}),
        scale(5),
        pos(center().x, 420),
        area({ scale: 0.7 }),
        anchor("center"),
        timer(),
        "player",
        hittable = true,
    ]);

    //Making an enemy
    const enemy = add([
    rect(40, 40),
    pos(center().x, 300),
    color(255, 0, 0), // Red color
    area(),
    health(5),
    anchor("center"),
    enemy_attack(player),
    "enemy",
    ]);
    // Player controls
    
    onKeyPress("left", () => { player.move(-1200, 0); player.play("dodge_left"); hittable = false; wait(0.5, () => {player.move(1200,0), player.play("idle")}); hittable = true;});
    onKeyPress("right", () => { player.move(1200, 0); hittable = false; wait(0.5, () => {player.move(-1200,0)}); hittable = true;});
    onKeyPress("down", () => { player.move(0, 1200); hittable = false; wait(0.5, () => {player.move(0,-1200)}); hittable = true;});
    onKeyPress("z", () => {
        if(action_check){
            action_check = false;
            player.play("punch");
            player.move(0,-800); 
            wait(0.1,() => 
                player_attack(player),
                wait(0.2,() => player.play("idle"), player.move(0,800))
        ); 
            
            action_check = true;
        }
        else{
            return
        }
    })
    
    enemy.on("death", () => {
        destroy(enemy)
    })
    enemy.onCollide("punch_punch", (player_punch) =>{
        enemy.hurt(1)
    })
    player.onCollide("enemy_punch", (enemy_punch) => {
        if(hittable){
            destroy(player)
        }
        else{
            return
        }
    })
})


go("main")