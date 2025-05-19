class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    preload() {
        this.load.image('bg2-1', 'assets/bg2-1.png');
        this.load.image('bg2-2', 'assets/bg2-2.png');
        this.load.image('bg2-3', 'assets/bg2-3.png');
        this.load.image('bg2-4', 'assets/bg2-4.png');
        this.load.image('bg2-5', 'assets/bg2-5.png');
        this.load.image('ground2', 'assets/platform1.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.audio('bgMusiclvl2', 'assets/musiclvl2.mp3');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(400, 300, 'bg2-1').setScale(2);
        this.add.image(400, 300, 'bg2-2').setScale(2);
        this.add.image(400, 300, 'bg2-3').setScale(2);
        this.add.image(400, 300, 'bg2-4').setScale(2);
        this.add.image(400, 300, 'bg2-5').setScale(2);

        this.bgMusic = this.sound.add('bgMusiclvl2', { loop: true, volume: 0.5 });
        this.bgMusic.play();

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground2').setScale(2).refreshBody();
        this.platforms.create(150, 500, 'ground2'); //lower left
        this.platforms.create(300, 400, 'ground2'); //mid left
        this.platforms.create(500, 300, 'ground2'); //mid right
        this.platforms.create(700, 200, 'ground2'); //upper right

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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

        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();
        this.score = 0;
        this.gameOver = false;
        this.playerScale = 1;
        this.colorIndex = 0;
        this.scoreText = this.add.text(500, 16, 'Stars Collected: 0', { fontSize: '24px', fill: '#000' });
        this.levelText = this.add.text(0, 16, 'Level 2', { fontSize: '24px', fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Stars Collected: ' + this.score);

        player.setTint(rainbowColors[this.colorIndex]);
        this.colorIndex = (this.colorIndex + 1) % rainbowColors.length;

        if ((this.score / 10) % 5 === 0) {
            this.playerScale += 0.1;
            this.player.setScale(this.playerScale);
        }

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }

        if(this.score >= 10){
            this.bgMusic.stop();
            this.scene.start('Level3');
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        this.bgMusic.stop();
        this.scene.start('GameOver',{level: 'Level1',});
        player.setTint(0xff0000);   
        player.anims.play('turn');
        player.visible = false;
        alert("Game Over! You collected " + this.score + " stars.");
        this.gameOver = true;
    }
}
