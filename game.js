// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});

// This section will be to load assets
loadSprite("playerChar", "https://kaboomjs.com/sprites/gigagantrum.png")

// Custom Code
function enemy_attack(owner){
    loop(1, () => {add([
        rect(5,15),
        pos(250,50),
        area(),
        move(90,1200),
    ])
    })
}
function attack(owner,opponent){
    add([
        rect(owner.x,owner.y),
        color(0,0,0),
        pos(owner.x,owner.y),
        move(180,-1200),
    ])
}
// Main game scene
scene("main",(level) => {

    //player creation
    const player = add([
        sprite("playerChar"),
        pos(center().x-70, 400),
        area({ scale: 0.7 }),
        body(),
        timer(),
        "player",
        hittable = true,
    ]);
    // Player controls
    onKeyDown("left", () => { player.move(-200, 0); hittable = false; wait(0.25, () => {player.move(200,0)}); hittable = true;});
    onKeyDown("right", () => { player.move(200, 0); hittable = false; wait(0.25, () => {player.move(-200,0)}); hittable = true;});
    onKeyDown("down", () => { player.move(0, 200); hittable = false; wait(0.25, () => {player.move(0,-200)}); hittable = true;});
    onKeyPress("z", () => {player.move(0,-300); wait(0.1,() => destroy(enemy),); wait(0.1,() => player.move(0,300))})

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
    
    // player.onCollide("punch", (punch, col) =>{
    // destroy(player)
    // })
})


go("main")