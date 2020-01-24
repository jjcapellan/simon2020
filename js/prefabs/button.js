class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, frame) {
      super(scene, x, y, 'atlas', frame);
      this.setAlpha(0.01);
      this.setInteractive();
      this.scene.add.existing(this);
    }

    click(){
        this.scene.sound.playAudioSprite('sounds','click');
        this.setAlpha(1);
        setTimeout(()=>{
            this.setAlpha(0.01);
        }, 200);
    }

    toggle(){
        this.scene.sound.playAudioSprite('sounds','click');
        if(this.alpha == 1){
            this.setAlpha(0.1);
        } else {
            this.setAlpha(1);
        }
    }

  }