class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('menuBg', 'assets/menu_bg.png');
        this.load.audio('menuMusic', 'assets/menu.mp3');
    }

    create() {
        this.add.image(400, 300, 'menuBg');
        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        this.menuMusic.play();

        const startButton = this.add.text(300, 300, 'Start Game', { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.menuMusic.stop();
                this.scene.start('Level1');
            });
    }
}
