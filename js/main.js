function runGame(width, height) {
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
