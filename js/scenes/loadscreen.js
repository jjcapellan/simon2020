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
        
        this.load.audioSprite('sounds','assets/sounds/audiospritesimon.json','assets/sounds/audiospritesimon.mp3');

    }

    updateLoad(progress) {
        this.text_loading.text = `Loading assets... ${Math.round(progress * 100)}%`;
    }
}
