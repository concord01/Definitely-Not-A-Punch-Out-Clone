// Initializing Kaboom
kaboom({
    width:500,
    height:800,
    background: [100,200,200]
});
// This section will be to load assets
loadSpriteAtlas("enemy.png", {
    "enemy": {
        x: 0,
        y: 0,
        width: 64,
        height: 96,
        sliceX: 2,
        sliceY: 3,
        anims: {
            "idle": {
                from: 0,
                to: 1,
                speed: 2,
                loop: true
            },
            "punch": {
                from: 2,
                to: 3,
                speed: 2,
                loop: false
            },
            "hurt": {
                from: 4,
                to: 5,
                speed: 4,
                loop: true
            }
        }
    }
})
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
                    from: 2, // Starting frame index for this animation
                    to: 5, // Ending frame index for this animation
                    speed: 20, // Animation speed (frames per second)
                    loop: true, // Whether the animation should loop
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
enemy_hittable = true;
function enemy_attack(owner){
    destroyed = false;
    onDestroy((owner) => {
        destroyed = true;
    })
    wait(rand(2), () => {
        if (destroyed){
            return;
        }
        else{
        owner.play("punch")
        enemy_hittable = false
        wait(0.5, () => {
            add([
            rect(5,15),
            pos(250,owner.y),
            area(),
            move(90,1200),
            anchor("center"),
            opacity(0),
            "enemy_punch"
            ])
        })
        wait(1, () => {
            owner.play("idle")
            enemy_hittable = true;
        })
        
    }
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
        opacity(0),
        "player_punch"
    ])
};
// Main game scene
scene("main",(level) => {

    //Making an enemy
    const enemy = add([
    sprite("enemy", {anim: "idle"}),
    pos(center().x, 300),
    area(),
    health(30),
    scale(7),
    anchor("center"),
    "enemy",
    ]);

    //player creation
    const player = add([
        sprite("player", {anim: "idle"}),
        pos(center().x, 370),
        scale(5),
        area({ scale: 0.3}),
        anchor("center"),
        timer(),
        health(5),
        "player",
        hittable = true,
    ]);
    //health values 
    enemy_health = enemy.hp()
    const enemy_health_label =add([
        text("Enemy Health:" + enemy_health),
        scale(0.5),
        pos(24,24),
        fixed(),
    ]);
    player_health = player.hp()
    const player_health_label =add([
        text("Player Health:" + player_health),
        scale(0.5),
        pos(24,48),
        fixed(),
    ]);

    // Player controls
    action_check = true;
    onKeyPress("left", () => { 
        if(action_check){
            action_check = false;
            player.play("dodge_left");
            player.move(-2400,0); 
            wait(0.5,() => {player.moveTo(center().x, 370), player.play("idle")})
            wait(0.6,() => {action_check = true;})
        }
    });
    onKeyPress("right", () => { 
        if(action_check){
            action_check = false;
            player.play("dodge_right");
            player.move(2400,0); 
            wait(0.5,() => {player.moveTo(center().x, 370), player.play("idle")})
            wait(0.6,() => {action_check = true;})
        }
    });

    onKeyPress("z", () => {
        if(action_check){
            action_check = false;
            player.play("punch");
            player.move(0,-800); 
            wait(0.1,() => {player_attack(player)})
            wait(0.2,() => {player.play("idle"), player.moveTo(center().x, 370)})
            wait(0.3,() => {action_check = true;})
        }
        }); 
    // calling enemy attack funciton on loop
    loop(3, () => {
        enemy_attack(enemy)
    })
    // On collision events and on thing death events
    enemy.on("death", () => {
        destroy(enemy)
        wait(1.5, () => {go("win")})
    })
    enemy.onCollide("player_punch", (player_punch) =>{
        if (enemy_hittable) {
        enemy.hurt(1)
        enemy.play("hurt")
        enemy_health = enemy_health-1;
        enemy_health_label.text= "Enemy Health: "+enemy_health
        wait(1.5, () => {enemy.play("idle")})
        }
    })
    player.onCollide("enemy_punch", (enemy_punch) => {
        if(hittable){
            player.hurt(1)
            player.play("hurt")
            action_check = false;
            player_health = player_health - 1;
            player_health_label.text= "Player Health: "+player_health
            wait(1.5, () => {player.play("idle"), action_check = true})
        }
        else{
            return
        }
    })
    player.on("death", () => {
        destroy(player)
        wait(1.5, () => {go("lose")})
    })
})
//Scene that plays when you die
scene("lose", () => {
    add([ text("Game Over \n Press Z to start again"), pos(center()), anchor("center") ]);
    onKeyPress("z", () => {
        go("main")
        })
})
scene("win", () => {
    add([ text("You Win!!!!!!!! \n Press Z to start again!"), pos(center()), anchor("center") ]);
     onKeyPress("z", () => {
        go("main")
        })
})


go("main")