// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});

// This section will be to load assets
loadSprite("enemy", "https://kaboomjs.com/sprites/gigagantrum.png")

// Main game scene
scene("main",(level) => {

    //player creation
    const player = add([
        sprite("enemy"),
        pos(center().x-70, 400),
        area({ scale: 0.7 }),
        body(),
        timer(),
        "player",
    ]);
    // Player controls
    onKeyDown("left", () => { player.move(-200, 0); wait(0.25, () => {player.move(200,0)})});
    onKeyDown("right", () => { player.move(200, 0); wait(0.25, () => {player.move(-200,0)})});
    onKeyPress("down", () => { player.move(0, 200); wait(0.25, () => {player.move(0,-200)})});

    //Making an enemy
    const enemy = add([
    rect(40, 40),
    pos(center().x, 80),
    color(255, 0, 0), // Red color
    area(),
    anchor("center"),
    "enemy",
]);
})


go("main")