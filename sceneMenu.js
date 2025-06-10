      var sceneMenu = new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function () {
          Phaser.Scene.call(this, { key: "sceneMenu" });
        },

        init() {},

        preload() {
          // Fixed file paths - remove leading slashes and use relative paths
          this.load.image("bg_start", "./images/bg_start.png");
          this.load.image("btn_play", "./images/btn_play.png");
          this.load.image("title_game", "./images/title_game.png");
          this.load.image("panel_skor", "./images/panel_skor.png");

          this.load.audio("snd_ambience", "./audio/ambience.mp3");
          this.load.audio("snd_touch", "./audio/touch.mp3");
          this.load.audio("snd_transisi_menu", "./audio/transisi_menu.mp3");

          this.load.spritesheet("sps_mummy", "./sprite/mummy37x45.png", {
            frameWidth: 37,
            frameHeight: 45,
          });

          // Add error handling for failed loads
          this.load.on('filecomplete', function (key, type, data) {
            console.log('Loaded:', key, type);
          });

          this.load.on('loaderror', function (file) {
            console.error('Failed to load:', file.src);
          });
        },

        create: function () {
          var mummy = this.add.sprite(1024 / 2, 768 - 170, "sps_mummy");
          mummy.setDepth(10);
          mummy.setScale(3);
          this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("sps_mummy", {
              start: 0,
              end: 17,
            }),
            frameRate: 16,
          });
          mummy.play({ key: "walk", repeat: -1 });

          X_POSITION = {
            LEFT: 0,
            CENTER: this.sys.game.canvas.width / 2,
            RIGHT: this.sys.game.canvas.width,
          };

          Y_POSITION = {
            TOP: 0,
            CENTER: this.sys.game.canvas.height / 2,
            BOTTOM: this.sys.game.canvas.height,
          };

          this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "bg_start");

          var btnPlay = this.add.image(
            X_POSITION.CENTER,
            Y_POSITION.CENTER,
            "btn_play"
          );
          
          if (snd_ambience == null) {
            snd_ambience = this.sound.add("snd_ambience");
            snd_ambience.loop = true;
            snd_ambience.setVolume(0.35);
            snd_ambience.play();
          }

          this.snd_touch = this.sound.add("snd_touch");
          var snd_transisi = this.sound.add("snd_transisi_menu");

          // Use sessionStorage as fallback for GitHub Pages
          var skorTertinggi = 0;
          try {
            skorTertinggi = localStorage.getItem("highscore") || 0;
          } catch (e) {
            console.warn("localStorage not available, using sessionStorage");
            skorTertinggi = sessionStorage.getItem("highscore") || 0;
          }

          var panelSkor = this.add.image(1024 / 2, 768 - 120, "panel_skor");
          panelSkor.setOrigin(0.5);
          panelSkor.setDepth(10);
          panelSkor.setAlpha(1);

          var lblSkor = this.add.text(
            panelSkor.x + 25,
            panelSkor.y,
            "High Score : " + skorTertinggi
          );
          lblSkor.setOrigin(0.5);
          lblSkor.setDepth(10);
          lblSkor.setFontSize(25);
          lblSkor.setTint(0xff732e);

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
            onComplete: function () {
              snd_transisi.play();
            },
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
            duration: 750,
            delay: 1000,
            scaleX: 1,
            scaleY: 1,
          });

          panelSkor.setAlpha(0);
          this.tweens.add({
            targets: panelSkor,
            ease: "Power2",
            duration: 500,
            delay: 1250,
            alpha: 1,
          });

          lblSkor.setAlpha(0);
          this.tweens.add({
            targets: lblSkor,
            ease: "Power2",
            duration: 500,
            delay: 1500,
            alpha: 1,
          });

          var btnClicked = false;

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
                this.snd_touch.play();
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
        },

        update() {},
      });
