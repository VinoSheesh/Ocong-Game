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
    this.load.image("panel_skor", "images/panel_skor.png");
  },

  create: function() {

    var skorTertinggi = localStorage["highscore"] || 0;

    var panelSkor = this.add.image(1024/2, 768-120,'panel_skor');
    panelSkor.setOrigin(0.5);
    panelSkor.setDepth(10);
    panelSkor.setAlpha(0);

    var lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, "High Score : "+ skorTertinggi);
    lblSkor.setOrigin(0.5);
    lblSkor.setDepth(10);
    lblSkor.setFontSize[30];
    lblSkor.setTint(0xff732e);

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

    this.input.on(
      "gameobjectover",
      function (pointer, gameObject) {
        console.log("Scene Menu | Object Over");
        if (!btnClicked) return;
        if (gameObject == btnPlay) {
          btnPlay.setTint(0x616161);
        }
      },
      this
    );
    this.input.on(
      "gameobjectout",
      function (pointer, gameObject) {
        console.log("Scene Menu | Object Out");
        if (!btnClicked) return;
        if (gameObject == btnPlay) {
          btnPlay.setTint(0xffffff);
          btnClicked = true;
        }
      },
      this
    );
    this.input.on(
      "gameobjectdown",
      function (pointer, gameObject) {
        console.log("Scene Menu | Object Click");
        if (gameObject == btnPlay) {
          btnPlay.setTint(0x616161);
          btnClicked = true;
        }
      },
      this
    );
    this.input.on(
      "gameobjectup",
      function (pointer, gameObject) {
        console.log("Scene Menu | Object End Click");
        if (gameObject == btnPlay) {
          btnPlay.setTint(0xffffff);

          this.scene.start("scenePlay");
        }
      },
      this
    );
    this.input.on(
      "pointerup",
      function (pointer, gameObject) {
        console.log("Scene Menu | Mouse Up");
        btnClicked = false;
      },
      this
    );

    btnPlay.setInteractive();

    var btnClicked = false;
  },

  update() {},
});
