class GButton extends Phaser.GameObjects.Image {
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
}