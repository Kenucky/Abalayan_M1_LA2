class Congratulations extends Phaser.Scene {
    constructor() {
        super('Congratulations');
    }

    preload() {
        this.load.image('congratsBg', 'assets/congratulations.png');
        this.load.audio('congratsMusic', 'assets/congrats.mp3');
    }

    create() {
        this.add.image(400, 300, 'congratsBg').setScale(2); 
        this.sound.play('congratsMusic');

        this.add.text(250, 250, 'You Win! Congratulations!', { fontSize: '32px', fill: '#fff' });

        this.add.text(300, 350, 'Main Menu', { fontSize: '32px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
                this.sound.stopAll();
            });
    }
}
