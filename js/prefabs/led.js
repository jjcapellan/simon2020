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

  }