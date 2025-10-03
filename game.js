// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});

// This section will be to load assets
loadSprite("playerChar", "https://kaboomjs.com/sprites/gigagantrum.png")

// Custom Code
function enemy_attack(){
    return {
        id: "enemy_attack",
        require: [ "pos", "area" ],
        add() {
            rect(5,15),
            area(),
            body(),
            "punch"
        },
    };
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
    ]);
    // Player controls
    onKeyDown("left", () => { player.move(-200, 0); wait(0.25, () => {player.move(200,0)})});
    onKeyDown("right", () => { player.move(200, 0); wait(0.25, () => {player.move(-200,0)})});
    onKeyDown("down", () => { player.move(0, 200); wait(0.25, () => {player.move(0,-200)})});
    onKeyPress("z", () => {player.move(0,-300); wait(0.1,() => destroy(enemy),); wait(0.1,() => player.move(0,300))})

    //Making an enemy
    const enemy = add([
    rect(40, 40),
    pos(center().x, 80),
    color(255, 0, 0), // Red color
    area(),
    anchor("center"),
    "enemy",
    //wait(3,() => enemy_attack()),
    ]);

    // player.onCollide("punch", (punch, col) =>{
    //     destroy(player)
    // })
})


go("main")