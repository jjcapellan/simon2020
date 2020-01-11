class Led extends Phaser.GameObjects.Image {
    constructor(scene, x, y, frame) {
      super(scene, x, y, 'atlas', frame);
      this.setAlpha(0);
      this.twOn;
      this.twOff;
  
      this.init();
      this.scene.add.existing(this);
    }
  
    init() {
      let t = this;
      t.twOn = t.scene.tweens.add({
        targets: t,
        alpha: '1',
        duration: 500,
        ease: 'Cubic',
        paused: true
      });

      t.twOff = t.scene.tweens.add({
        targets: t,
        alpha: '0',
        duration: 500,
        ease: 'Cubic',
        paused: true
      });

      t.twPulses = t.scene.tweens.add({
        targets: t,
        alpha: '1',
        duration: 500,
        ease: 'Cubic',
        yoyo: true,
        repeat: 3,
        onRepeat: ()=> { t.scene.sndLed.play() },
        paused: true
      });
    }

    turnOn(){
        this.twOn.play();
        this.scene.sndLed.play();
    }

    turnOff(){
        this.twOff.play();
    }

    pulses(){
      this.twPulses.play();
    }

  }class GButton extends Phaser.GameObjects.Image {
  constructor(scene, x, y, frame, sound) {
    super(scene, x, y, 'atlas', frame);
    this.setInteractive();
    this.setAlpha(0.1);
    this.id = parseInt(sound.substr(sound.length - 1)) - 1;
    this.sound = this.scene.sound.add(sound);
    this.tween;

    this.init();
    this.scene.add.existing(this);
  }

  init() {
    let t = this;
    t.tween = t.scene.tweens.add({
      targets: t,
      alpha: '1',
      yoyo: true,
      duration: 200,
      ease: 'Cubic',
      paused: true
    });
    t.twpulses = t.scene.tweens.add({
      targets: t,
      alpha: '1',
      yoyo: true,
      duration: 200,
      repeat: 3,
      ease: 'Cubic',
      paused: true
    });
    t.on('pointerdown', t.clicked, t);
  }

  clicked(isMachine) {
    let t = this;
    t.scene.lastNote = t.id;
    t.tween.play();
    if (typeof isMachine == 'boolean') {
      t.sound.play();
      setTimeout(() => {
        if(!t.scene.onGame)return;
        t.scene.currentNote++;
        t.scene.playNotes();
      }, 600);
    } else {
      if (!t.checkNote()) {
        t.scene.sndError.play();
        t.scene.ledPlayer.turnOff();
        t.scene.endGame();
        return;
      }

      t.sound.play();
      t.scene.noteIndex++;
      if (t.scene.noteIndex > t.scene.notes.length - 1) {
        t.scene.disableButtons();
        setTimeout(() => {
          if(!t.scene.onGame)return;
          t.scene.upScore();
          t.scene.sndScore.play();
        }, 400);
        setTimeout(() => {
          if(!t.scene.onGame)return;
          t.scene.ledPlayer.turnOff();
          t.scene.ledCpu.turnOn();
          t.scene.machineTurn();
        }, 600);

      }
    }
  }

  checkNote() {
    let t = this;
    let succes = (t.scene.notes[t.scene.noteIndex] == t.scene.lastNote);
    return succes;
  }

  flash() {
    if (this.tween.isPlaying()) {
      this.tween.restart();
    } else {
      this.tween.play();
    }
  }

  pulses(){
    this.twpulses.play();
  }
}class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, frame) {
      super(scene, x, y, 'atlas', frame);
      this.setAlpha(0.01);
      this.setInteractive();
      this.scene.add.existing(this);
    }

    click(){
        this.scene.sndClick.play();
        this.setAlpha(1);
        setTimeout(()=>{
            this.setAlpha(0.01);
        }, 200);
    }

    toggle(){
        this.scene.sndClick.play();
        if(this.alpha == 1){
            this.setAlpha(0.1);
        } else {
            this.setAlpha(1);
        }
    }

  }class Boot extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  init(){
    this.imgFolder = this.game.config.width + 'x' + this.game.config.height;
    this.registry.set('imgfolder', this.imgFolder);
    if(this.game.config.height > 640){
      this.registry.set('scale', 2);
    } else {
      this.registry.set('scale', 1);
    }
  }

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.image('logo',`assets/imgs/${this.imgFolder}/logo.png`);
  }

  create(){
    let t = this;
    WebFont.load({
      custom: {
          families: ['novasquare']
      },
      active: function ()
      {
          t.scene.start('loadScreen');
      }
  });
  }

}
class LoadScreen extends Phaser.Scene {
    constructor() {
        super('loadScreen');
    }

    init(){
        this.imgFolder = this.registry.get('imgfolder');
    }

    preload() {
        this.load.on('complete', ()=>{
            this.scene.start('inGame');
        }, this);
        this.load.on('progress', this.updateLoad, this);
        let logo = this.add.image(this.game.config.width / 2, this.game.config.height / 3, 'logo');
        let style = { fontFamily: 'novasquare', fontSize: 20, color: '#ffffff', lineSpacing: -10 };
        this.text_loading = this.add.text(logo.x, logo.y + logo.height, 'Loading assets...', style);

        this.load.atlas('atlas', `assets/imgs/${this.imgFolder}/simon.png`, `assets/imgs/${this.imgFolder}/simonatlas.json`);

        this.load.audio('note1', 'assets/sounds/note1.mp3');
        this.load.audio('note2', 'assets/sounds/note2.mp3');
        this.load.audio('note3', 'assets/sounds/note3.mp3');
        this.load.audio('note4', 'assets/sounds/note4.mp3');
        this.load.audio('score', 'assets/sounds/score.mp3');
        this.load.audio('error', 'assets/sounds/error.mp3');
        this.load.audio('click', 'assets/sounds/click.mp3');
        this.load.audio('led', 'assets/sounds/led.mp3');

    }

    updateLoad(progress) {
        this.text_loading.text = `Loading assets... ${Math.round(progress * 100)}%`;
    }
}
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
    t.b1 = new GButton(this, 112 * s, 151 * s, 'backlight', 'note1'); // ul
    t.b2 = new GButton(this, 246 * s, 151 * s, 'backlight', 'note2'); // ur
    t.b3 = new GButton(this, 112 * s, 331 * s, 'backlight', 'note3'); // dl
    t.b4 = new GButton(this, 246 * s, 331 * s, 'backlight', 'note4'); // dr

    t.buttons = [t.b1, t.b2, t.b3, t.b4];

    t.disableButtons();
  }

  addFront() {
    let t = this;
    let s = t.sc;
    let styleDark = { fontFamily: 'novasquare', fontSize: 20 * s, color: '#000000', lineSpacing: -10 * s };

    t.add.image(0, 0, 'atlas', 'base').setOrigin(0, 0);

    t.txtScore = t.add.text(180 * s, 495 * s, '--', styleDark)
      .setOrigin(0.5, 0.5);
    t.txtHighScore = t.add.text(285 * s, 495 * s, `${t.highScore}`, styleDark).setColor('#ffffff')
      .setOrigin(0.5, 0.5)
      .setAlpha(0.5);
  }

  addLeds() {
    let t = this;
    let s = t.sc;
    t.ledPlayer = new Led(t, 45 * s, 477 * s, 'greenhalo');
    t.ledCpu = new Led(t, 45 * s, 494 * s, 'greenhalo');
    t.ledGameOver = new Led(t, 45 * s, 511 * s, 'redhalo');
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


}function runGame(width, height) {
  var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x343434,
    scale: {
      parent: 'game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: width,
      height: height
  },
    scene: [Boot, LoadScreen, InGame]
  };

  new Phaser.Game(config);
}

window.onload = function () {
  let clientHeight = document.getElementById('container').clientHeight;
  let width = 360;
  let height = 640;  
  if(clientHeight > 700){
    width = 720;
    height = 1280;
  }
  runGame(width, height);
};
