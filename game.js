var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//init variables
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
const rainbowColors = [
    0xff0000, // red
    0xffa500, // orange
    0xffff00, // yellow
    0x00ff00, // green
    0x0000ff, // blue
    0x4b0082, // indigo
    0xee82ee  // violet
];
let colorIndex = 0;
let playerScale = 1;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg1', 'assets/1.png');
    this.load.image('bg2', 'assets/2.png');
    this.load.image('bg3', 'assets/3.png');
    this.load.image('bg4', 'assets/4.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ground2', 'assets/platform1.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'bg1').setScale(2); // sky bg
    this.add.image(400, 300, 'bg2').setScale(2); // sky bg
    this.add.image(400, 300, 'bg3').setScale(2); // sky bg
    this.add.image(400, 300, 'bg4').setScale(2); // sky bg

    
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground2').setScale(2).refreshBody();

    //platforms positions
    platforms.create(600, 400, 'ground2');
    platforms.create(50, 250, 'ground2');
    platforms.create(750, 220, 'ground2');

    
    player = this.physics.add.sprite(100, 450, 'dude');

    //player physics
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //input
    cursors = this.input.keyboard.createCursorKeys();

    //12 stars and evenly spaced
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //slight bounch when stars are created
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //score
    scoreText = this.add.text(500, 16, 'Stars Collected: 0', { fontSize: '24px', fill: '#000' });

    //collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //checks to see if player overlaps with stars or bombs
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //add and update score
    score += 10;
    scoreText.setText('Stars Collected: ' + score);

    player.setTint(rainbowColors[colorIndex]);
    colorIndex = (colorIndex + 1) % rainbowColors.length;

    if((score/10) % 5 === 0){
        playerScale += 0.1;
        player.setScale(playerScale);
    }
    if (stars.countActive(true) === 0)
    {
        //stars respawn after all are collected
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    player.visible = false; //player dissapears after collision

    alert("Game Over! You collected " + score + " stars."); //alert player that game is over

    gameOver = true;
}