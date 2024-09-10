import './style.css';
import Phaser from 'phaser';

// Define the Bullet class first
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  fire(rotation) {
    this.setActive(true);
    this.setVisible(false);
    this.setScale(1)

    const bulletSpawnOffset = {
      x: 10,
      y: 0,
    };

    // Calculate direction to fire the bullet
    const velocity = 2000;
    const spread = 0.1
    const deviation = Math.random() * (spread - (0-spread)) + (0-spread);
    const angle = (rotation + deviation) + - Math.PI / 2;

    this.setRotation(angle);
    
    this.body.velocity.x = Math.cos(angle) * velocity;
    this.body.velocity.y = Math.sin(angle) * velocity;

    const bulletX = player.x + bulletSpawnOffset.x * Math.cos(angle) - bulletSpawnOffset.y * Math.sin(angle);
        const bulletY = player.y + bulletSpawnOffset.x * Math.sin(angle) + bulletSpawnOffset.y * Math.cos(angle);

        // Set bullet position
        this.setPosition(bulletX, bulletY);

        // Calculate bullet velocity based on player's rotation and speed
        const bulletVelocityX = Math.cos(angle) * velocity;
        const bulletVelocityY = Math.sin(angle) * velocity;

        // Add the player's velocity to the bullet's velocity
        this.body.velocity.x = bulletVelocityX + player.body.velocity.x;
        this.body.velocity.y = bulletVelocityY + player.body.velocity.y;
    
  }
  

  update(time, delta) {     
      if (this.setCollidesWith(player) != true) {
        this.setVisible(true)
      }
      

        // Create a tween to transition from white to yellow
      this.setAlpha(this.scale/1)
      if (this.scale < 1) {
        this.body.velocity.x = this.body.velocity.x/1.04;
        this.body.velocity.y = this.body.velocity.y/1.04;
      } else {
        this.body.velocity.x = this.body.velocity.x*1.1;
        this.body.velocity.y = this.body.velocity.y*1.1;
      }
      
      this.setScale(this.scaleX - 0.015)
    if (this.scale < 0 || this.scale < 0 ){
      this.setActive(false);
      this.setVisible(false);
    }  
  }
}


// Game configuration
const config = {
  type: Phaser.WEBGL,
  width: screen.width,
  height: screen.height,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',        
    arcade: {
      debug: false
    }
  },
  render: {
    antialias: true,       // Enable anti-aliasing
    antialiasGL: true      // For WebGL rendering
  },
  pixelArt: true,
  fps: {
    target: 60,  // Cap the frame rate to 60 FPS
    forceSetTimeOut: true, 
  },// Force the use of setTimeout for frame limiting
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let bullets;
let worldBounds = { width: 4000, height: 4000 };  // Large world size
let moveToPointer = false;
let shooting = false
let acceleration = 0
let maxSpeed = 2000
let lastShotTime = 0;
let interval = 100;
let lastActionTime = 0;

// Preload function (load assets)
function preload() {
  // Load a tile image for the background
  this.load.glsl('pixelate', 'assets/shaders/pixelate.frag');
  this.load.image('background', '/assets/tiled-bg.png');
  this.load.image('playerShip', '/assets/player.png');
  this.load.image('bullet', '/assets/bullet.png'); // Make sure to load the bullet image
}

// Create function (initial setup)
function create() {

  // Create a large tiled background
  //const background = this.add.tileSprite(0, 0, worldBounds.width, worldBounds.height, 'background');
  //background.setOrigin(0, 0);

  // Create player ship
  player = this.physics.add.sprite(400, 300, 'playerShip');
  player.setCollideWorldBounds(false);  // Stop player from moving out of bounds
  player.setDamping(true);
  player.setDrag(0.2 );  // Simulates space friction
  player.setMaxVelocity(900);

  // Create a group of bullets (for shooting)
  bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 80, // Adjust the max size as needed
    runChildUpdate: true
  });
 
  // Set up spacebar for thrusting
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Set up mouse input for shooting
  this.input.on('pointerdown', (pointer) => {
    if (pointer.leftButtonDown()) {
      shooting = true
      shootBullet.call(this);
    }
  });

  this.input.on('pointerup', (pointer) => {
    if (!pointer.leftButtonDown()) {
      shooting = false
    }
  });
}

// Update function (game loop)
function update(time, delta) {

  const pointer = this.input.activePointer;
  const pointerX = pointer.worldX;
  const pointerY = pointer.worldY;

  const movementSmoothFactor = 0.001; // Smoothing factor, between 0 (slow) and 1 (instant)
  //player.x = Phaser.Math.Linear(player.x, pointer.worldX, movementSmoothFactor);
  //player.y = Phaser.Math.Linear(player.y, pointer.worldY, movementSmoothFactor);

  const midX = (player.x + pointer.worldX) / 2;
  const midY = (player.y + pointer.worldY) / 2;

  
  const angleToPointer = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
  
  const targetAcceleration = new Phaser.Math.Vector2();
  //this.physics.velocityFromRotation(angleToPointer, 1000, targetAcceleration); // 300 is the target speed

  // Make the camera follow the midpoint
  //this.cameras.main.centerOn(midX, midY);
  const camera = this.cameras.main;
  const cameraSmoothFactor = 0.03; // Smoothing factor, between 0 (slow) and 1 (instant)
  camera.scrollX = Phaser.Math.Linear(camera.scrollX, midX - camera.width / 2, cameraSmoothFactor);
  camera.scrollY = Phaser.Math.Linear(camera.scrollY, midY - camera.height / 2, cameraSmoothFactor);
  // Rotate player to face the mouse pointer
  
  
  player.setRotation(angleToPointer + Math.PI / 2);  // Rotate to face the pointer
  // Move towards the pointer if the mouse button is held down
  if (moveToPointer) {
    player.setAcceleration(0);
  } 

  if (this.spacebar.isDown) {
    acceleration = 900
    maxSpeed = 2000
    moveToPointer = true
    this.physics.velocityFromRotation(angleToPointer, acceleration, player.body.acceleration);
  }

  if (!this.spacebar.isDown) {
    acceleration = 0
    moveToPointer = true;
    this.physics.velocityFromRotation(angleToPointer, acceleration, player.body.acceleration);

  // Cap the velocity to a maximum speed (gradual stop when released)
  const currentSpeed = Phaser.Math.Distance.Between(0, 0, player.body.velocity.x, player.body.velocity.y);
  if (currentSpeed > maxSpeed) {
    player.body.velocity.scale(maxSpeed / currentSpeed); // Scale velocity to maxSpeed
  }
  } else {
    moveToPointer = false;
  }

  if (shooting == true) {
    shootBullet()
  }

  
}

function getAveragePosition(x1, y1, x2, y2) {
    const avgX = (x1 + x2) / 2;
    const avgY = (y1 + y2) / 2;
    
    return { x: avgX, y: avgY };
}

// Function to shoot a bullet
function shootBullet() {
    const bullet = bullets.get(player.x, player.y);
    if (bullet) {
      bullet.fire(player.rotation); 
    }
  }

