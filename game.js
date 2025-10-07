// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});

// This section will be to load assets
loadSprite("playerChar", "https://kaboomjs.com/sprites/gigagantrum.png");

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
function player_attack(player){
    add([
        rect(owner.x,owner.y),
        color(0,0,0),
        pos(owner.x,owner.y),
        move(180,-1200),
    ])
};
// Main game scene
scene("main",(level) => {

    //player creation
    const player = add([
        rect(20,20),
        pos(center().x-10, 400),
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
    onKeyPress("z", () => {player.move(0,-300); wait(0.1,() => enemy.hurt(1),); wait(0.1,() => player.move(0,300))})
    
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