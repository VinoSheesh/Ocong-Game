var sceneMenu = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneMenu" });
  },

  init() {},

  preload() {
    this.load.image("bg_start", "images/bg_start.png");
    this.load.image("btn_play", "images/btn_play.png");
    this.load.image("title_game", "images/title_game.png");
  },

  create() {
    this.add.image(1024 / 2, 768 / 2, "bg_start");

    var btnPlay = this.add.image(1024 / 2, 768 / 2 + 75, "btn_play");

    this.titleGame = this.add.image(1024 / 2, 200, "title_game");
    this.titleGame.setDepth(10);

    this.titleGame.y -= 384;

    var diz = this;

    this.tweens.add({
      targets: diz.titleGame,
      ease: "Bounce.easeOut",
      duration: 750,
      delay: 250,
      y: 200,
    });

    btnPlay.setScale(0);

    this.tweens.add({
      targets: btnPlay,
      ease: "Back",
      duration: 500,
      delay: 750,
      scaleX: 1,
      scaleY: 1,
    });

    this.titleGame.setScale(0);

    this.tweens.add({
      targets: diz.titleGame,
      ease: "Elastic",
      duraztion: 750,
      delay: 1000,
      scaleX: 1,
      scaleY: 1,
    });
  },

  update() {},
});
