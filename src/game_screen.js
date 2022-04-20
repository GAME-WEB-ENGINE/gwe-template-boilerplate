let { GWE } = require('gwe');

class GameScreen extends GWE.Screen {
  constructor(app) {
    super(app);
  }

  onEnter() {
    GWE.gfxManager.setShowDebug(true);

    this.cameraSpeed = 0.1;
    this.lastMousePosition = [0, 0];
    this.dragLength = [0, 0];
    this.view = GWE.gfxManager.getView(0);

    this.mesh = new GWE.GfxJAMDrawable();
    this.mesh.setPosition([0, 0, -10]);
    this.mesh.loadFromFile('./assets/models/cube.jam');
    this.mesh.play('IDLE', true);

    GWE.textureManager.loadTexture('./assets/models/cube.jpg').then(() => {
      this.mesh.setTexture(GWE.textureManager.getTexture('./assets/models/cube.jpg'));
    });
  }

  handleEvent(event) {
    if (event instanceof GWE.MouseDragBeginEvent) {
      this.lastMousePosition = event.position;
      this.lastRotation = this.view.getRotation();
    }

    if (event instanceof GWE.MouseDragEvent) {
      let newRotation = [0, 0, 0];
      this.dragLength = [event.position[0] - this.lastMousePosition[0], event.position[1] - this.lastMousePosition[1]];      
      newRotation[1] = this.lastRotation[1] + this.dragLength[0] * 0.01;
      newRotation[0] = this.lastRotation[0] + this.dragLength[1] * 0.01;
      this.view.setRotation(newRotation);
    }
  }

  update(ts) {
    let cameraMatrix = this.view.getCameraMatrix();
    let deltaPosition = [0, 0, 0];

    if (GWE.inputManager.isKeyDown(GWE.InputKeyEnum.Q)) {
      deltaPosition[0] += cameraMatrix[0] * this.cameraSpeed * -1;
      deltaPosition[1] += cameraMatrix[1] * this.cameraSpeed * -1;
      deltaPosition[2] += cameraMatrix[2] * this.cameraSpeed * -1; 
    }

    if (GWE.inputManager.isKeyDown(GWE.InputKeyEnum.D)) {
      deltaPosition[0] += cameraMatrix[0] * this.cameraSpeed * +1;
      deltaPosition[1] += cameraMatrix[1] * this.cameraSpeed * +1;
      deltaPosition[2] += cameraMatrix[2] * this.cameraSpeed * +1; 
    }

    if (GWE.inputManager.isKeyDown(GWE.InputKeyEnum.Z)) {
      deltaPosition[0] += cameraMatrix[ 8] * this.cameraSpeed * -1;
      deltaPosition[1] += cameraMatrix[ 9] * this.cameraSpeed * -1;
      deltaPosition[2] += cameraMatrix[10] * this.cameraSpeed * -1; 
    }

    if (GWE.inputManager.isKeyDown(GWE.InputKeyEnum.S)) {
      deltaPosition[0] += cameraMatrix[ 8] * this.cameraSpeed * +1;
      deltaPosition[1] += cameraMatrix[ 9] * this.cameraSpeed * +1;
      deltaPosition[2] += cameraMatrix[10] * this.cameraSpeed * +1;
    }

    this.view.move(deltaPosition[0], deltaPosition[1], deltaPosition[2]);
    this.mesh.update(ts);
  }

  draw(viewIndex) {
    this.mesh.draw();
    GWE.gfxManager.drawDebugGrid(GWE.Utils.MAT4_ROTATE_X(Math.PI * 0.5), 20, 1);
  }
}

module.exports.GameScreen = GameScreen;