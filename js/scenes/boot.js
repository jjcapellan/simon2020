class Boot extends Phaser.Scene {
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
