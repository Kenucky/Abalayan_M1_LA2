class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('gameOverBg', 'assets/gameover.png');
        this.load.audio('gameOverSound', 'assets/gameover.mp3');
    }

    create() {
        this.add.image(400, 300, 'gameOverBg').setScale(2);
        this.sound.play('gameOverSound');

        this.add.text(300, 250, 'Game Over', { fontSize: '48px', fill: '#fff' });

        this.add.text(300, 350, 'Retry', { fontSize: '32px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Level1'); 
                this.sound.stopAll();
    
            });

        this.add.text(300, 400, 'Main Menu', { fontSize: '32px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
                this.sound.stopAll();
            });
    }
}
