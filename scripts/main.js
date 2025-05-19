const config = {
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
    scene: [MainMenu,Level1,Level2,Level3,GameOver,Congratulations]  
};

const game = new Phaser.Game(config);
