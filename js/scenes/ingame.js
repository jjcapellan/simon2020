class InGame extends Phaser.Scene {
  constructor() {
    super('inGame');
    this.notes = [0];
    this.noteIndex = 0;
    this.currentNote = 0;
    this.lastNote = 1000;
    this.score = 0;
    this.highScore = 0;
    this.onGame = false;
  }

  init() {
    this.sc = this.registry.get('scale');
  }

  create() {
    let t = this;

    t.addSounds();
    t.addButtons();
    t.addFront();
    t.addLeds();
    t.addUiButtons();
    t.addTweens();    
  }



  // GAME OBJECTS ///////////////////////////////////////
  ///////////////////////////////////////////////////////

  addSounds() {
    let t = this;
    t.sndScore = t.sound.add('score');
    t.sndError = t.sound.add('error');
    t.sndClick = t.sound.add('click');
    t.sndLed = t.sound.add('led');
  }

  addButtons() {
    let t = this;
    let s = t.sc;
    t.b1 = new GButton(this, 112 * s, 151 * s, 'backlight', { ox: 0.5, oy: 0.5 }, 'note1'); //ul
    t.b2 = new GButton(this, 246 * s, 151 * s, 'backlight', { ox: 0.5, oy: 0.5 }, 'note2'); // ur
    t.b3 = new GButton(this, 112 * s, 331 * s, 'backlight', { ox: 0.5, oy: 0.5 }, 'note3'); // dl
    t.b4 = new GButton(this, 246 * s, 331 * s, 'backlight', { ox: 0.5, oy: 0.5 }, 'note4'); // dr

    t.buttons = [t.b1, t.b2, t.b3, t.b4];

    t.disableButtons();
  }

  addFront() {
    let t = this;
    let s = t.sc;
    let styleDark = { fontFamily: 'novasquare', fontSize: 20 * s, color: '#000000', lineSpacing: -10 * s };

    t.add.image(0, 0, 'atlas', 'base').setOrigin(0, 0);

    t.txtScore = t.add.text(180 * s, 495 * s, '--', styleDark);
    t.txtHighScore = t.add.text(285 * s, 495 * s, `${t.highScore}`, styleDark).setColor('#ffffff')
      .setAlpha(0.5);
  }

  addLeds() {
    let t = this;
    let s = t.sc;
    t.ledPlayer = new Led(t, 45 * s, 477 * s, 'greenhalo');
    t.ledCpu = new Led(t, 45 * s, 494 * s, 'greenhalo');
    t.ledGameOver = new Led(t, 45 * s, 511 * s, 'redhalo');
    t.ledGameOver.turnOn();
  }

  addUiButtons() {
    let t = this;
    let s = t.sc;
    t.btPlay = new Button(t, 180 * s, 543 * s, 'btplay');
    t.btPlay.on('pointerdown', () => {
      t.btPlay.toggle();
      if (t.btPlay.alpha == 1) {
        t.initGame();
      } else {
        t.endGame();
      }
    })
    t.btReset = new Button(t, 285 * s, 534 * s, 'btreset');
    t.btReset.on('pointerdown', () => {
      t.btReset.click();
      t.setHighScore(0);
    })
  }

  addTweens() {
    let t = this;
    t.twScore = t.tweens.add({
      targets: t.txtScore,
      alpha: '0.5',
      yoyo: true,
      duration: 200,
      ease: 'Cubic',
      paused: true
    });

    t.twHighScore = t.tweens.add({
      targets: t.txtHighScore,
      scale: '1.3',
      yoyo: true,
      duration: 300,
      ease: 'Cubic',
      paused: true
    });
  }



  // COLOR BUTTONS //////////////////////////////////////
  ///////////////////////////////////////////////////////

  disableButtons() {
    this.buttons.forEach(bt => {
      bt.removeInteractive();
    });
  }

  enableButtons() {
    this.buttons.forEach(bt => {
      bt.setInteractive();
    });
  }

  flashButtons() {
    this.buttons.forEach(bt => {
      bt.flash();
    });
  }

  pulseButtons() {
    this.buttons.forEach(bt => {
      bt.pulses();
    });
  }



  // SCORE //////////////////////////////////////////////
  ///////////////////////////////////////////////////////

  upScore() {
    this.score++;
    this.txtScore.setText(this.score);
    this.twScore.play();
  }

  setHighScore(score) {
    let t = this;
    t.highScore = score;
    t.txtHighScore.setText(`${t.highScore}`);
    t.twHighScore.play();
  }



  // GAME LOGIC /////////////////////////////////////////
  ///////////////////////////////////////////////////////  


  initGame() {
    let t = this;
    t.ledGameOver.turnOff();
    t.score = -1;
    t.upScore();
    t.onGame = true;
    t.machineTurn();
  }

  endGame() {
    let t = this;
    t.onGame = false;
    t.disableButtons();
    t.ledGameOver.pulses();
    t.notes = [Phaser.Math.RND.integerInRange(0, 3)];
    t.pulseButtons();

    setTimeout(() => {
      t.txtScore.setText('--');
      t.twScore.play();
      if (t.score > t.highScore) {
        t.setHighScore(t.score);
      }
      this.ledCpu.turnOff();
      this.ledPlayer.turnOff();
      t.score = 0;
      if (t.btPlay.alpha == 1) {
        t.btPlay.toggle();
      }
    }, 2000);
  }

  playNotes() {
    let index = this.notes[this.currentNote];
    if (index != undefined) {
      this.buttons[index].clicked(true);
    } else {
      this.flashButtons();
      this.ledCpu.turnOff();
      this.ledPlayer.turnOn();
      this.playerTurn();
    }
  }

  machineTurn() {
    this.disableButtons();
    this.currentNote = 0;
    this.notes.push(Phaser.Math.RND.integerInRange(0, 3));
    setTimeout(() => {
      this.playNotes();
    }, 1000);

  }

  playerTurn() {
    this.noteIndex = 0;
    this.enableButtons();
  }


}