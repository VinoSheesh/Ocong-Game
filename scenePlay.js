var scenePlay = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "scenePlay" });
  },
  init: function () {},
  preload: function () {
    this.load.image("chara", "images/chara.png");
    this.load.image("fg_loop_back", "images/fg_loop_back.png");
    this.load.image("fg_loop", "images/fg_loop.png");
    this.load.image("obstc", "images/obstc.png");
    this.load.image("panel_skor", "images/panel_skor.png");
  },
  create: function () {
    this.background = [];

    this.isGameRunning = false;

    this.chara = this.add.image(130, 768 / 2, "chara");
    this.chara.setDepth(3);

    this.chara.setScale(0);

    this.timerHalangan = 0;
    this.halangan = [];

    this.score = 0;

    this.panel_score = this.add.image(1024 / 2, 60, "panel_skor");
    this.panel_score.setOrigin(0.5);
    this.panel_score.setDepth(10);
    this.panel_score.setAlpha(0.8);

    this.label_score = this.add.text(
      this.panel_score.x + 25,
      this.panel_score.y,
      this.score
    );
    this.label_score.setOrigin(0.5);
    this.label_score.setDepth(10);
    this.label_score.setFontSize(30);
    this.label_score.setTint(0xff732e);

    this.gameOver = function () {

      let highScore = localStorage[highscore] || 0;

      if(myScene.score > highScore){
        localStorage["highscore"] = myScene.score;
      }
      myScene.scene.start("sceneMenu");
    };

    var myScene = this;
    var bg_x = 1366 / 2;

    for (let i = 0; i < 2; i++) {
      var bg_awal = [];

      var BG = this.add.image(bg_x, 768 / 2, "fg_loop_back");
      var FG = this.add.image(bg_x, 768 / 2, "fg_loop");

      BG.setData("kecepatan", 2);
      FG.setData("kecepatan", 4);
      FG.setDepth(2);

      bg_awal.push(BG);
      bg_awal.push(FG);

      this.background.push(bg_awal);

      bg_x += 1366;
    }

    this.tweens.add({
      delay: 250,
      targets: this.chara,
      ease: "Back.Out",
      duration: 500,
      scaleX: 1,
      scaleY: 1,
      onComplete: function () {
        myScene.isGameRunning = true;
      },
    });

    this.input.on(
      "pointerup",
      function (pointer, currentlyOver) {
        if (!this.isGameRunning) return;

        this.charaTweens = this.tweens.add({
          targets: this.chara,
          ease: "Power1",
          duration: 750,
          y: this.chara.y + 200,
        });
      },
      this
    );
  },
  update: function () {
    if (this.isGameRunning) {
      this.chara.y -= 5;

      if (this.chara.y > 690) this.chara.y = 690;
    }

    for (let i = 0; i < this.background.length; i++) {
      for (var j = 0; j < this.background[i].length; j++) {
        this.background[i][j].x -= this.background[i][j].getData("kecepatan");

        if (this.background[i][j].x <= -(1366 / 2)) {
          var diff = this.background[i][j].x + 1366 / 2;

          this.background[i][j].x = 1366 + 1366 / 2 + diff;
        }
      }
    }

    if (this.timerHalangan == 0) {
      var acak_y = Math.floor(Math.random() * 680 + 60);

      var halanganBaru = this.add.image(1500, acak_y, "obstc");

      halanganBaru.setOrigin(0, 0);
      halanganBaru.setData("status_aktif", true);
      halanganBaru.setData("kecepatan", Math.floor(Math.random() * 15 + 10));

      this.halangan.push(halanganBaru);

      this.timerHalangan = Math.floor(Math.random() * 50 + 10);

      halanganBaru.setDepth(3);
    }

    for (let i = this.halangan.length - 1; i >= 0; i--) {
      this.halangan[i].x -= this.halangan[i].getData("kecepatan");

      if (this.halangan[i].x < -200) {
        this.halangan[i].destroy();

        this.halangan.splice(i, 1);
        break;
      }
    }

    this.timerHalangan--;

    for (var i = this.halangan.length - 1; i >= 0; i--) {
      if (
        this.chara.x > this.halangan[i].x + 50 &&
        this.halangan[i].getData("status_aktif") == true
      ) {
        this.halangan[i].setData("status_aktif", false);
        this.score++;
        this.label_score.setText(this.score);
      }
    }

    for (let i = this.halangan.length - 1; i >= 0; i--) {
      if (
        this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)
      ) {
        this.halangan[i].setData("status_aktif", false);
        this.isGameRunning = false;

        if (this.charaTweens != null) {
          this.charaTweens.stop();
        }

        var myScene = this;

        this.charaTweens = this.tweens.add({
          targets: this.chara,
          ease: "Elastic.easeOut",
          duration: 2000,
          alpha: 0,
          onComplete: myScene.gameOver,
        });

        break;
      }
    }

    if (this.chara.y < -50) {
      this.isGameRunning = false;

      if (this.charaTweens != null) {
        this.charaTweens.stop();
      }

      let myScene = this;

      this.charaTweens = this.tweens.add({
        targets: this.chara,
        ease: "Elastic.easeOut",
        duration: 2000,
        alpha: 0,
        onComplete: myScene.gameOver,
      });
    }
  },
});
