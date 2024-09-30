import './style.css';
import Phaser from 'phaser';

// Define the Bullet class first

class dashLine extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y) {
    super(scene, x, y, 'dashLine');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
    this.spawnTimer = 0;
    this.spawnInterval = 4000;
  }

  spawn(rotation) {
    this.setAlpha(0)
    this.setActive(true);
    this.setVisible(false);

  // Generate random x and y coordinates within the screen size
  const randomX = Phaser.Math.Between(Phaser.Math.Between(player.x-1500, player.x-1250), Phaser.Math.Between(player.x+1250, player.x+1500));
      const randomY = Phaser.Math.Between(Phaser.Math.Between(player.y-1500, player.y-1250), Phaser.Math.Between(player.y+1250, player.y+1500));
      this.setPosition(randomX, randomY);

    const angle = player.rotation/2 + - Math.PI / 2;

    this.setRotation(angle);  
  }
    // Set bullet position
    //this.setPosition(posX, posY);
    
  update(time, delta) {

    const deltaTime = delta / 1000;

    // Update the spawn timer
    this.spawnTimer += delta;

    // Spawn only if the timer exceeds the interval
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0; // Reset timer
      this.spawn(); // Spawn a new item
    }
    const cameraVelocityX = this.scene.cameras.main.scrollX - this.prevCameraX;
    const cameraVelocityY = this.scene.cameras.main.scrollY - this.prevCameraY;

    // Calculate the camera velocity
    const cameraVelocity = Math.sqrt(cameraVelocityX * cameraVelocityX + cameraVelocityY * cameraVelocityY);

    // Store the camera's current position for the next frame
    this.prevCameraX = this.scene.cameras.main.scrollX;
    this.prevCameraY = this.scene.cameras.main.scrollY;

    const velocityX = player.body.velocity.x;
    const velocityY = player.body.velocity.y;
    const pos = Math.abs(Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y));
    if (pos > 1500) {         
      const randomX = Phaser.Math.Between(Phaser.Math.Between(player.x-1500, player.x-1250), Phaser.Math.Between(player.x+1250, player.x+1500));
      const randomY = Phaser.Math.Between(Phaser.Math.Between(player.y-1500, player.y-1250), Phaser.Math.Between(player.y+1250, player.y+1500));
      this.setPosition(randomX, randomY);
    }

    const velocity = (Math.abs(player.body.velocity.x)+Math.abs(player.body.velocity.y))
  
    const scaleX = Phaser.Math.Clamp(cameraVelocity / 10, 0.08, 2000);
    // Calculate the angle of movement in radians
    const angle = Math.atan2(cameraVelocityY, cameraVelocityX);
    //this.setAlpha((pos)/1500)
    this.setAlpha((1-(pos/1500)) * (1-((cameraVelocity)/35)))
    if (this.visible == false) {
      this.setVisible(true)
    }
    
    this.setActive(true)
    
    //this.setAlpha(1)
    this.setRotation(angle)
    this.setScale(scaleX/2,(1/2))
   

  }
}

class Upgrade extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y) {
    super(scene, x, y, 'upgrade');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
    this.speed = 0
    this.power = 1
    this.lifespan =0
    this.id = Phaser.Math.Between(0,8);
  }


  tintColor() {
    let offensive = 0xff0000;
    let utility = 0x4a00ff;
    let defensive = 0x0cff00;
    let speed = 0x002eff;
    let range = 0xff7800
    switch(this.id) {
      case 0: // spread
        this.setTint(utility)
        break
      case 1: // firerate
        this.setTint(offensive)
        break;
      case 2: // speed
        this.setTint(speed)
        break
      case 3: // acceleration
        this.setTint(speed)
        break
      case 4: // damage
        this.setTint(offensive)
        break
      case 5: // health
        this.setTint(defensive)
        break
      case 6: // range
        this.setTint(range)
        break
      case 7: // vision
        this.setTint(range)
        break
      case 8: // bulletspeed
        this.setTint(utility)
        break
      default:
        this.setTint(0xed00ff)
        break
    }
    return
  }

  spawn(x,y,p){
    this.setScale(0.5 +(0.2 *(p)))
    this.body.setCircle(this.body.width/2);
    let scaleFactor = Phaser.Math.Clamp(this.scale*100, 0, 1);  // Clamp between 0 and 1

    this.tintColor();
    this.lifespan = 500
    this.power=p
    //this.angle = Phaser.Math.Between(0, 360);
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x,y)
    this.body.maxVelocity.set(2000)
  }
  update(time, delta){
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    
    this.setAlpha((this.lifespan)/500)
    this.lifespan--
    if (this.alpha <= 0) {
      this.setActive(false)
      this.setVisible(false);
    }

    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // Optionally, you can add a check to stop movement when the enemy reaches the player
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance > 400) {
        // Stop the enemy's movement when it's close enough to the player
        this.speed = 0;
    }
    else {this.speed+=0.1}
    
  }
}
class BasicEnemy extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y) {
    super(scene, x, y, 'basicEnemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
    this.health=0
    this.speed=0
    this.power=1
    this.radius = 0
    this.birth = true
    this.setBounce(2)
    this.setDamping(true);
    this.setDrag(0.2 );
    this.maxRotationSpeed = 100;
    this.angularAcceleration = 10;
    
  }

  async hit(that) {
    let object = that.constructor.name
    switch(object) {
      case "Bullet":
        if(that.visible == false) {
          return
         }
         that.setVisible(false)
        setTimeout(async () => {
          that.setActive(false)
          that.setVisible(false)
          that.destroy();
          this.health = this.health - that.damage
          if (this.health <= 0) {
            this.setTintFill(0xff0051);
             await spawnUpgrade(this.x, this.y, this.power)
             
          }
          else {
            this.setTintFill(0xffffff);
          }
          bulletBasicEnemyOverlap.active=false
        },5);
        setTimeout(async () => { 
          if (this.health <= 0){
           await this.spawn()
          }
          this.clearTint()
          bulletBasicEnemyOverlap.active=true
        }, 50);
        break;
      case "BasicEnemy":
        basicEnemyCollision.active=false
      if(this.scale <= 50) {
        this.setScale(this.scale +(that.scale/40))
        this.health = this.health + that.health
        this.speed = 250*(1/this.scale);
      }
      that.health=0
      this.setTintFill(0xfff5a2);
      that.setTintFill(0xfff5a2);
      setTimeout(async () => { 
      if (that.health <= 0){
        this.power = Phaser.Math.Clamp(this.power + that.power,1,10)
        await that.spawn()
        await this.clearTint()
        await that.clearTint()
      }
      basicEnemyCollision.active=true
    }, 50);
        break
      default:
        this.health--
        player.setTint(0xff0051)
        if (this.health <= 0) {
          this.setTintFill(0xff0051);
        }
        else {
          this.setTintFill(0xffffff);
        }
          setTimeout(async () => {
            if (this.health <= 0) {
              await this.spawn()
            }
            this.clearTint()
            player.clearTint()
          }, 50);
        break;
    }
    return
      
  }

  scaling(min, max) {
    let randomFloat = Phaser.Math.FloatBetween(0, 1);
        // Apply logarithmic scaling: using Math.pow() to transform the random float
        let logRandom = Math.pow(10, randomFloat);
        // Scale it to the desired range (min, max)
        let scaledRandom = min + (logRandom - 1) / 9 * (max - min);
        return scaledRandom
  }

  spawn(){
    this.clearTint()
    this.setScale(this.scaling(0.9,2));
    this.acceleration = 0.1
    this.speed = 250*(1/this.scale);
    this.setMaxVelocity(this.speed)
    this.power= Math.floor(this.scale)
    if (this.birth == true) {
      this.radius = this.body.width/2
      this.body.setCircle(this.radius);
      this.birth = false
    }
    this.health=this.scale
    //this.setScale(1)
    const radius = 2000;
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    
    //this.body.setOffset(-this.radius, -this.radius);
    
    const offsetX = radius * Math.cos(angle);
    const offsetY = radius * Math.sin(angle);
    const posX = player.x + offsetX;
    const posY = player.y + offsetY;
    this.setPosition(posX, posY);

  }

  update(time,delta){
    this.setActive(true);
    this.setVisible(true);
    let angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y );
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, angle, 0.01)
  

    // Calculate the movement direction based on the object's current angle
    let radians = Phaser.Math.DegToRad(this.angle);

    // Apply velocity in the direction the object is facing (based on its rotation)
    this.body.velocity.x = Math.cos(radians) * this.speed;
    this.body.velocity.y = Math.sin(radians) * this.speed;
  }
}
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
    this.body.setSize(15,15)
    
    this.cooldown = 10
    this.frames = 0
    this.damage = 1* upgrade.damage
    this.firerate = Phaser.Math.Clamp(40 - upgrade.firerate, 10, 40)
    this.spread = Phaser.Math.Clamp(0.3 - upgrade.spread, 0.07, 0.3)
    this.velocity = 2000 + upgrade.bulletspeed
  }

  async fire(rotation) {
    this.setScale(1.1)
    
      this.setTint(0xffffff)
      this.setActive(true);
      this.setVisible(true);
      this.setScale(1)

      const velocity = this.velocity
      const spread = this.spread
      const deviation = Math.random() * (spread - (0-spread)) + (0-spread);
      const angle = (rotation + deviation) + - Math.PI / 2;
      this.setRotation(angle);
      this.setBounce(1)
  
      const bulletSpawnOffset = {
        x: 10,
        y: 0,
      };
  
      // Calculate direction to fire the bullet
      this.body.velocity.x = Math.cos(angle) * velocity;
      this.body.velocity.y = Math.sin(angle) * velocity;
  
      const bulletX = player.x + bulletSpawnOffset.x * Math.cos(angle) - bulletSpawnOffset.y * Math.sin(angle);
      const bulletY = player.y + bulletSpawnOffset.x * Math.sin(angle) + bulletSpawnOffset.y * Math.cos(angle);
  
      // Set bullet position
      this.setPosition(bulletX, bulletY);
      
  
      // Calculate bullet velocity based on player's rotation and speed
      const bulletVelocityX = Math.cos(angle) * velocity;
      const bulletVelocityY = Math.sin(angle) * velocity;

      if (this.x == player.x && this.y == player.y || this.body.velocity.x == 0 && this.body.velocity.y == 0) {
        this.setActive(false)
        this.setVisible(false)
      }
  
      // Add the player's velocity to the bullet's velocity
      this.body.velocity.x = bulletVelocityX + (player.body.velocity.x/2);
      this.body.velocity.y = bulletVelocityY + (player.body.velocity.y/2);
  }

  update(time, delta) {
      
      if (this.scale < 1) {
        this.clearTint()
        this.body.velocity.x = this.body.velocity.x/1.01;
        this.body.velocity.y = this.body.velocity.y/1.01;
      } else {
        this.body.velocity.x = this.body.velocity.x*1.1;
        this.body.velocity.y = this.body.velocity.y*1.1;
      }
      this.setScale(this.scaleX - upgrade.range)
    if (this.scale < 0.4 || this.body.velocity < 12 ){
      this.setActive(false)
      this.setVisible(false)
    }  
    
    
  }
}
class Cursor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'cursor');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(true);
    this.setVisible(true);  
    
    this.spawn()
    
    
  }
  spawn(){
    this.setTintFill(0xff0000);
    this.setDepth(1)  
  }
}



// Game configuration
const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',        
    arcade: {
      fps: 144,          // Sets the physics update rate to 60 FPS
      timeStep: 1 / 144,  // Defines the fixed timestep as 1/60 seconds (60Hz)
      debug: false       // Enable this to visualize physics objects (optional)
    }
  },
  fps: {
    target: 144,
    forceSetTimeOut: true,
  },
  render: {
    antialias: true,       // Enable anti-aliasing
    antialiasGL: true      // For WebGL rendering
  },
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

let player;
let upgrade= {
  spread: 0,
  firerate: 40,
  speed: 0,
  acceleration: 0,
  damage: 1,
  health: 0,
  range: 0.02,
  vision: 50,
  bulletspeed: 0,
}
let cursor;
let angleToPointer
let cursorDistance
let pad;
let xAxis
let yAxis
var maxRadius = 200
let lastPosition = { x: 0, y: 0 }
let nextPosition = {x: 0, y: 0 }
let cursorMoving
let bullets;
let upgrades
let dashLines;
let basicEnemies
let worldBounds = { width: 10000, height: 10000 };  // Large world size
let moveToPointer = false;
let shooting = false
let player_acceleration = 0
let player_speed = 1800
let frames = 0
let maxVelocity = 1200 + upgrade.speed
let basicEnemyCollision
let playerBasicEnemyCollision
let bulletBasicEnemyOverlap

// Preload function (load assets)
function preload() {
  // Load a tile image for the background
  this.load.glsl('bloom', 'assets/shaders/shader0.frag');
  this.load.glsl('pixelate', 'assets/shaders/pixelate.frag');
  this.load.image('background', '/assets/tiled-bg.png');
  this.load.image('playerShip', '/assets/player.png');
  this.load.image('bullet', '/assets/bullet.png'); 
  this.load.image('dashLine', '/assets/dash-line.png');
  this.load.image('basicEnemy', '/assets/basic-enemy.png')
  this.load.image('upgrade', '/assets/upgrade-base.png')
  this.load.image('cursor', '/assets/cursor.png')
}

// Create function (initial setup)
function create() {

  this.time.delayedCall(500, () => {
    const cursorWidth = 40
  const cursorHeight = 40

  this.input.setDefaultCursor(`url(assets/cursor.png) ${cursorWidth/2} ${cursorHeight/2}, pointer`);


  // Create player ship
  player = this.physics.add.sprite(0, 0, 'playerShip');
  player.setCollideWorldBounds(false);  // Stop player from moving out of bounds
  player.setDamping(true);
  player.setDrag(0.2 );  // Simulates space friction
  player.setMaxVelocity(maxVelocity);
  player.setBounce(2)
  player.body.setCircle((player.body.width*1.3)/2);

  // Create a group of bullets (for shooting)
  bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 100, // Adjust the max size as needed
    runChildUpdate: true
  });

  dashLines = this.physics.add.group({
    classType: dashLine,
    maxSize: 1000, // Adjust the max size as needed
    runChildUpdate: true,
  });

  basicEnemies = this.physics.add.group({
    classType: BasicEnemy,
    maxSize: 20,
    runChildUpdate: true,
  });

  upgrades = this.physics.add.group({
    classType: Upgrade,
    maxSize: 20,
    runChildUpdate: true,
  });

  cursor = this.physics.add.sprite(0, 0, 'cursor');
  cursor.setTintFill(0xffffff);
  cursor.setDepth(3)
  })

  

  this.time.delayedCall(500, () => {
    // Enable collision detection between enemies
basicEnemyCollision = this.physics.add.collider(basicEnemies, basicEnemies, function response (e1, e2) {
  if(e1.scale> e2.scale) {e1.hit(e2)} 
  else {e2.hit(e1)}
});
let upgradePlayer =this.physics.add.overlap(player, upgrades, function collectUpgrade(player, upgradeObj) {
  let power = Math.floor(upgradeObj.power)
  upgradePlayer.active = false
  console.log(upgrade)
  switch(upgradeObj.id){
    case 0:
      upgrade.spread = upgrade.spread + (0.05*power)
      break;
    case 1:
      upgrade.firerate = Phaser.Math.Clamp(upgrade.firerate - (1*power), 10, 40)
      break;
    case 2:
      if (maxVelocity <= 1800) {
        upgrade.speed = upgrade.speed + (50*power);
        maxVelocity =  Phaser.Math.Clamp(maxVelocity + upgrade.speed, 0, 1800)
        player.setMaxVelocity(maxVelocity);
      }
      break;
    case 3:
        upgrade.acceleration = Phaser.Math.Clamp(upgrade.acceleration + (100*power), 0, 5000)
      break;
    case 4:
      upgrade.damage = upgrade.damage + (0.2*power)
      break;
    case 5:
      upgrade.health = upgrade.health + (1*power)
      break;
    case 6:
        upgrade.range =  Phaser.Math.Clamp(upgrade.range - (0.005*power),0.005, 1 )
      
      break;
    case 7: 
      upgrade.vision = upgrade.vision + (10*power)
      maxRadius = maxRadius + upgrade.vision
      break;
      case 8: 
      upgrade.bulletspeed= Phaser.Math.Clamp(upgrade.bulletspeed + (50*power), 0, 1000)
    default:
      break;
  }

  setTimeout(() => {
    upgradeObj.destroy()
    upgradePlayer.active = true
  return
  },50)
  
  
  
  
})

bulletBasicEnemyOverlap = this.physics.add.overlap(basicEnemies, bullets, function hitBasicEnemy(enemy, bullet) {
  enemy.hit(bullet)
}) 

playerBasicEnemyCollision = this.physics.add.collider(basicEnemies, player, function hitBasicEnemy(player, enemy) {
  enemy.hit(player)
})
})

  // Set up spacebar for thrusting
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Set up mouse input for shooting
  this.input.on('pointerdown', (pointer) => {
    if (pointer.leftButtonDown()) {
      shooting = true
      shootBullet.call(this);
    }
  });

  this.input.on(`pointermove`, (pointer) => {
    cursorMoving = true
    
    player.setRotation(angleToPointer + Math.PI / 2);

    let cursorToPointer = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, cursor.x, cursor.y);

    cursor.setAlpha((cursorToPointer-50)/70)
    
    
  })

  this.input.on('pointerup', (pointer) => {
    if (!pointer.leftButtonDown()) {
      shooting = false
      frames = 15
    }
  });

  if (this.input.gamepad) {
    // No gamepads connected yet, so we wait for one to be connected
    this.input.gamepad.once('connected', this.onGamepadConnected, this);
    this.onGamepadConnected(this.input.gamepad.pad1);
  }
}

// Update function (game loop)
function update(time, delta) {
  frames++

  if (this.input.gamepad && this.input.gamepad.total > 0) {
    const gamepad = this.input.gamepad.getPad(0);
    

    if (gamepad) {
        this.handleGamepadInput(gamepad, delta);
    }
}




  //cursor.body.velocity = player.body.velocity
  
  const pointer = this.input.mousePointer;
  let pointerX = pointer.worldX;
  let pointerY = pointer.worldY;
  const camera = this.cameras.main;
  let centerX
  let centerY
  centerX = (player.x * 1)
  centerY = (player.y * 1)

  

  
  nextPosition = {x: centerX - lastPosition.x, y: lastPosition.y - centerY}

  let cameraSmoothFactor = 0.08;
  if (moveToPointer) {
    player.setAcceleration(0);
  }
  
  let movementSmoothFactor = 1

  let targetX
  let targetY
  
  
  // Smoothly move the sprite towards the cursor's position
  if (cursorMoving){
    cursorDistance = Phaser.Math.Distance.Between(player.x, player.y, cursor.x, cursor.y)
    targetX = Phaser.Math.Linear(cursor.x, pointer.worldX, movementSmoothFactor);
    targetY = Phaser.Math.Linear(cursor.y, pointer.worldY, movementSmoothFactor);
  }
  else {
    targetX = Phaser.Math.Linear(cursor.x, getFacingPosition(player, cursorDistance).x, movementSmoothFactor);
    targetY = Phaser.Math.Linear(cursor.y, getFacingPosition(player, cursorDistance).y, movementSmoothFactor);
  }
  

  // Calculate the distance from the center point
  var distance = Phaser.Math.Distance.Between(centerX, centerY, targetX, targetY);
  
  // If the distance is greater than the allowed radius, clamp the position
  if (distance > maxRadius) {
      // Get the angle from the center to the target
      var angle = Phaser.Math.Angle.Between(centerX, centerY, targetX, targetY);
 
      // Calculate the clamped position along the circle's edge
      targetX = centerX + Math.cos(angle) * (maxRadius);
      targetY = centerY + Math.sin(angle) * (maxRadius);
      
  }

  let midX = (player.x + cursor.x) / 2;
  let midY = (player.y + cursor.y) / 2;

  cursor.x = targetX
  cursor.y = targetY

  if (cursorMoving == true) {
    angleToPointer = Phaser.Math.Angle.Between(player.x, player.y, cursor.x, cursor.y);
    cursor.x = targetX
    cursor.y = targetY
  }
  else {
    cursor.x = Phaser.Math.Clamp(targetX, player.x-cursorDistance, player.x+cursorDistance)
    cursor.y = Phaser.Math.Clamp(targetY, player.y-cursorDistance, player.y+cursorDistance)
  }

  camera.scrollX = Phaser.Math.Linear(camera.scrollX, midX - camera.width / 2, cameraSmoothFactor);
  camera.scrollY = Phaser.Math.Linear(camera.scrollY, midY - camera.height / 2, cameraSmoothFactor);

  cursorMoving = false

    
  if (this.spacebar.isDown) {
    
    player_acceleration = 900 + upgrade.acceleration
    //player_speed = 38000
    moveToPointer = true
    this.physics.velocityFromRotation(angleToPointer, player_acceleration, player.body.acceleration);
  }

  if (!this.spacebar.isDown) {
    player_acceleration = 0
    moveToPointer = true;
    this.physics.velocityFromRotation(angleToPointer, player_acceleration, player.body.acceleration);

  // Cap the velocity to a maximum speed (gradual stop when released)
  const currentSpeed = Phaser.Math.Distance.Between(0, 0, player.body.velocity.x, player.body.velocity.y);
  if (currentSpeed > player_speed) {
    player.body.velocity.scale(player_speed / currentSpeed); // Scale velocity to player_speed
  }
  } else {
    moveToPointer = false;
  }

  if (shooting == true) {
      shootBullet()  
  }
  const velocity = (Math.abs(player.body.velocity.x)+Math.abs(player.body.velocity.y))
  if(velocity >= 0){
    spawndashLine(player.rotation/2 + - Math.PI / 2)
  }
  spawnBasicEnemy()
}

function getFacingPosition(player, distance) {

  // Calculate the new position 100 units in front of the player based on rotation
  let facingX = player.x + Math.cos(angleToPointer) * distance;
  let facingY = player.y + Math.sin(angleToPointer) * distance;

  // Return the calculated coordinates
  return { x: facingX, y: facingY };
}

function spawnBasicEnemy(){
  const enemy = basicEnemies.get(player.x, player.y)
  if (enemy){
    enemy.spawn()
  }
}


function spawndashLine() {
  const dashLine = dashLines.get(player.x, player.y)
  if (dashLine){
    dashLine.spawn(player.rotation/2 + - Math.PI / 2)
  }
}


// Function to shoot a bullet
function shootBullet() {
    const bullet = bullets.get(player.x, player.y);
    if (frames % upgrade.firerate == 0 && player.rotation != null && bullet != null ) {
      console.log(player.rotation)
      bullet.fire(player.rotation);
    }
    
      //setTimeout(async () => {
        //await bullet.fire(player.rotation);
      //}, 100);
  }

  function spawnUpgrade(x,y,p) {
    const upgrade = upgrades.get(player.x,player.y);
    if (upgrade) {
      upgrade.spawn(x,y,p)
    }
  }

  function lastPositionLogic(x,y) {
    if (lastPosition = {x: x, y: y }) {
    }
    else {
    }
    lastPosition = {
      x: x,
      y: y
    }
    return lastPosition
  }

  function onGamepadConnected(gamepad) {
}

function handleGamepadInput(gamepad, delta) {
    // Joystick movement
    const leftStickX = gamepad.leftStick.x; // X-axis of the left joystick
    const leftStickY = gamepad.leftStick.y; // Y-axis of the left joystick

    // Move player based on joystick movement
    if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
        this.player.x += leftStickX * this.playerSpeed * (delta / 1000);
        this.player.y += leftStickY * this.playerSpeed * (delta / 1000);
    }

    // Example: Checking for button press (A button)
    if (gamepad.A) {
    }
}
