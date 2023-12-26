import * as THREE from 'three'
import Rabbit from './Rabbit'
import Wolf from './Wolf'
import Tree from './Tree'
import Carrot from './Carrot'
import BonusParticles from './BonusParticles'
import Hedgehog from './Hedgehog'
import { TweenMax, Power4, gsap } from 'gsap'

export type GameStatusType =
  | 'play'
  | 'gameOver'
  | 'readyToReplay'
  | 'preparingToReplay'

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  fieldOfView: number,
  aspectRatio: number,
  nearPlane: number,
  farPlane: number,
  globalLight: THREE.AmbientLight,
  shadowLight: THREE.DirectionalLight,
  renderer: THREE.WebGLRenderer,
  container,
  clock: THREE.Clock

let floorShadow: THREE.Mesh, floorGrass: THREE.Mesh, floor: THREE.Group

let delta = 0
const floorRadius = 200
let speed = 6
let distance = 0
let level = 1
let levelInterval: string | number | NodeJS.Timeout | undefined
const levelUpdateFreq = 3000
const initSpeed = 5
const maxSpeed = 48
let wolfPos = 0.65
let wolfPosTarget = 0.65
let floorRotation = 0
const collisionObstacle = 10
const collisionBonus = 20
let gameStatus: GameStatusType = 'play'
const cameraPosGame = 160
const cameraPosGameOver = 260
const wolfAcceleration = 0.004
const malusClearColor = 0xb44b39
const malusClearAlpha = 0
const audio = new Audio('assets/race.mp3')

let fieldGameOver: HTMLDivElement

//SCREEN & MOUSE VARIABLES

let HEIGHT, WIDTH, windowHalfX, windowHalfY

//3D OBJECTS VARIABLES

let rabbit: Rabbit
let wolf: Wolf
let carrot: Carrot
let bonusParticles: BonusParticles
let obstacle: Hedgehog

const init = (target: HTMLDivElement) => {
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth

  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2

  scene = new THREE.Scene()

  scene.fog = new THREE.Fog(0xd6eae6, 160, 350)

  aspectRatio = WIDTH / HEIGHT
  fieldOfView = 50
  nearPlane = 1
  farPlane = 2000
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  )
  camera.position.x = 0
  camera.position.z = cameraPosGame
  camera.position.y = 30
  camera.lookAt(new THREE.Vector3(0, 30, 0))

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(malusClearColor, malusClearAlpha)

  renderer.setSize(WIDTH, HEIGHT)
  renderer.shadowMap.enabled = true

  container = target
  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', handleWindowResize, false)
  document.addEventListener('mousedown', handleMouseDown, false)
  document.addEventListener('touchend', handleMouseDown, false)

  clock = new THREE.Clock()
}

const createLight = () => {
  globalLight = new THREE.AmbientLight(0xffffff, 0.9)

  shadowLight = new THREE.DirectionalLight(0xffffff, 1)
  shadowLight.position.set(-30, 40, 20)
  shadowLight.castShadow = true
  shadowLight.shadow.camera.left = -400
  shadowLight.shadow.camera.right = 400
  shadowLight.shadow.camera.top = 400
  shadowLight.shadow.camera.bottom = -400
  shadowLight.shadow.camera.near = 1
  shadowLight.shadow.camera.far = 2000
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048

  scene.add(globalLight)
  scene.add(shadowLight)
}

const createFloor = () => {
  floorShadow = new THREE.Mesh(
    new THREE.SphereGeometry(floorRadius, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x7abf8e,
      specular: 0x000000,
      shininess: 1,
      transparent: true,
      opacity: 0.5
    })
  )
  //floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.receiveShadow = true

  floorGrass = new THREE.Mesh(
    new THREE.SphereGeometry(floorRadius - 0.5, 50, 50),
    new THREE.MeshBasicMaterial({
      color: 0x7abf8e
    })
  )
  //floor.rotation.x = -Math.PI / 2;
  floorGrass.receiveShadow = false

  floor = new THREE.Group()
  floor.position.y = -floorRadius

  floor.add(floorShadow)
  floor.add(floorGrass)
  scene.add(floor)
}

const createRabbit = () => {
  rabbit = new Rabbit()
  rabbit.mesh.rotation.y = Math.PI / 2
  scene.add(rabbit.mesh)
  rabbit.nod()
}

const createWolf = () => {
  wolf = new Wolf()
  wolf.mesh.position.z = 20
  scene.add(wolf.mesh)
  updateWolfPosition()
}

const createFirs = () => {
  const nTrees = 100
  for (let i = 0; i < nTrees; i++) {
    const phi = (i * (Math.PI * 2)) / nTrees
    let theta = Math.PI / 2
    theta +=
      Math.random() > 0.05
        ? 0.25 + Math.random() * 0.3
        : -0.35 - Math.random() * 0.1

    const fir = new Tree()
    fir.mesh.position.x = Math.sin(theta) * Math.cos(phi) * floorRadius
    fir.mesh.position.y = Math.sin(theta) * Math.sin(phi) * (floorRadius - 10)
    fir.mesh.position.z = Math.cos(theta) * floorRadius

    const vec = fir.mesh.position.clone()
    const axis = new THREE.Vector3(0, 1, 0)
    fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize())
    floor.add(fir.mesh)
  }
}

const createCarrot = () => {
  carrot = new Carrot()
  scene.add(carrot.mesh)
}

const updateCarrotPosition = () => {
  carrot.mesh.rotation.y += delta * 6
  carrot.mesh.rotation.z = Math.PI / 2 - (floorRotation + carrot.angle)
  carrot.mesh.position.y =
    -floorRadius + Math.sin(floorRotation + carrot.angle) * (floorRadius + 50)
  carrot.mesh.position.x =
    Math.cos(floorRotation + carrot.angle) * (floorRadius + 50)
}

const updateObstaclePosition = () => {
  if (obstacle.status === 'flying') return

  // TODO fix this,
  if (floorRotation + obstacle.angle > 2.5) {
    obstacle.angle = -floorRotation + Math.random() * 0.3
    obstacle.body.rotation.y = Math.random() * Math.PI * 2
  }

  obstacle.mesh.rotation.z = floorRotation + obstacle.angle - Math.PI / 2
  obstacle.mesh.position.y =
    -floorRadius + Math.sin(floorRotation + obstacle.angle) * (floorRadius + 3)
  obstacle.mesh.position.x =
    Math.cos(floorRotation + obstacle.angle) * (floorRadius + 3)
}

const updateWolfPosition = () => {
  wolf.run()

  wolfPosTarget -= delta * wolfAcceleration
  wolfPos += (wolfPosTarget - wolfPos) * delta

  if (wolfPos < 0.56) {
    gameOver()
  }

  const angle = Math.PI * wolfPos
  wolf.mesh.position.y = -floorRadius + Math.sin(angle) * (floorRadius + 12)
  wolf.mesh.position.x = Math.cos(angle) * (floorRadius + 15)
  wolf.mesh.rotation.z = -Math.PI / 2 + angle
}

function gameOver(this: any) {
  // TODO: fieldGameOver.className = "show"
  gameStatus = 'gameOver'
  wolf.sit((status: GameStatusType) => {
    gameStatus = status
  })
  rabbit.hang()
  wolf.rabbitHolder.add(rabbit.mesh)
  TweenMax.to(this, 1, { speed: 0 })
  TweenMax.to(camera.position, 3, { z: cameraPosGameOver, y: 60, x: -30 })
  carrot.mesh.visible = false
  obstacle.mesh.visible = false
  clearInterval(levelInterval)
}

const updateFloorRotation = () => {
  floorRotation += delta * 0.03 * speed
  floorRotation = floorRotation % (Math.PI * 2)
  floor.rotation.z = floorRotation
}

const createObstacle = () => {
  obstacle = new Hedgehog()
  obstacle.body.rotation.y = -Math.PI / 2
  obstacle.mesh.scale.set(1.1, 1.1, 1.1)
  obstacle.mesh.position.y = floorRadius + 4
  obstacle.nod()
  scene.add(obstacle.mesh)
}

const createBonusParticles = () => {
  bonusParticles = new BonusParticles()
  bonusParticles.mesh.visible = false
  scene.add(bonusParticles.mesh)
}

const checkCollision = () => {
  const db = rabbit.mesh.position.clone().sub(carrot.mesh.position.clone())
  const dm = rabbit.mesh.position.clone().sub(obstacle.mesh.position.clone())

  if (db.length() < collisionBonus) {
    getBonus()
  }

  if (dm.length() < collisionObstacle && obstacle.status != 'flying') {
    getMalus()
  }
}

const getBonus = () => {
  bonusParticles.mesh.position.copy(carrot.mesh.position)
  bonusParticles.mesh.visible = true
  bonusParticles.expose()
  carrot.angle += Math.PI / 2
  wolfPosTarget += 0.025
}

function getMalus(this: any) {
  obstacle.status = 'flying'
  const tx =
    Math.random() > 0.5 ? -20 - Math.random() * 10 : 20 + Math.random() * 5
  TweenMax.to(obstacle.mesh.position, 4, {
    x: tx,
    y: Math.random() * 50,
    z: 350,
    ease: Power4.easeOut
  })
  TweenMax.to(obstacle.mesh.rotation, 4, {
    x: Math.PI * 3,
    z: Math.PI * 3,
    y: Math.PI * 6,
    ease: Power4.easeOut,
    onComplete: function () {
      obstacle.status = 'ready'
      obstacle.body.rotation.y = Math.random() * Math.PI * 2
      obstacle.angle = -floorRotation - Math.random() * 0.4

      obstacle.angle = obstacle.angle % (Math.PI * 2)
      obstacle.mesh.rotation.x = 0
      obstacle.mesh.rotation.y = 0
      obstacle.mesh.rotation.z = 0
      obstacle.mesh.position.z = 0
    }
  })
  //
  wolfPosTarget -= 0.04
  TweenMax.from(this, 0.5, {
    malusClearAlpha: 0.5,
    onUpdate: function () {
      renderer.setClearColor(malusClearColor, malusClearAlpha)
    }
  })
}

const updateDistance = () => {
  distance += delta * speed
  const d = distance / 2
  // TODO: fieldDistance.innerHTML = Math.floor(d);
}

const updateLevel = () => {
  if (speed >= maxSpeed) return
  level++
  speed += 2
}

const loop = () => {
  delta = clock.getDelta()
  wolf.speed = speed
  wolf.maxSpeed = maxSpeed
  wolf.delta = delta
  rabbit.speed = speed
  rabbit.maxSpeed = maxSpeed
  rabbit.delta = delta
  updateFloorRotation()

  if (gameStatus === 'play') {
    if (rabbit.status === 'running') {
      rabbit.run()
    }
    updateDistance()
    updateWolfPosition()
    updateCarrotPosition()
    updateObstaclePosition()
    checkCollision()
  }

  render()
  requestAnimationFrame(loop)
}

const render = () => {
  renderer.render(scene, camera)
}

const initializer = (target: HTMLDivElement) => {
  init(target)
  createLight()
  createFloor()
  createRabbit()
  createWolf()
  createFirs()
  createCarrot()
  createBonusParticles()
  createObstacle()
  resetGame()
  loop()
}

const resetGame = () => {
  scene.add(rabbit.mesh)
  rabbit.mesh.rotation.y = Math.PI / 2
  rabbit.mesh.position.y = 0
  rabbit.mesh.position.z = 0
  rabbit.mesh.position.x = 0

  wolfPos = 0.56
  wolfPosTarget = 0.65
  speed = initSpeed
  level = 0
  distance = 0
  carrot.mesh.visible = true
  obstacle.mesh.visible = true
  gameStatus = 'play'
  rabbit.status = 'running'
  rabbit.nod()
  audio.play()
  updateLevel()
  levelInterval = setInterval(updateLevel, levelUpdateFreq)
}

const unmount = () => {}

const handleWindowResize = () => {
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  windowHalfX = WIDTH / 2
  windowHalfY = HEIGHT / 2
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
}

const handleMouseDown = (event: MouseEvent | TouchEvent) => {
  if (gameStatus == 'play') rabbit.jump()
  else if (gameStatus == 'readyToReplay') {
    replay()
  }
}

const replay = () => {
  gameStatus = 'preparingToReplay'

  fieldGameOver.className = ''

  gsap.killTweensOf(wolf.pawFL.position)
  gsap.killTweensOf(wolf.pawFR.position)
  gsap.killTweensOf(wolf.pawBL.position)
  gsap.killTweensOf(wolf.pawBR.position)

  gsap.killTweensOf(wolf.pawFL.rotation)
  gsap.killTweensOf(wolf.pawFR.rotation)
  gsap.killTweensOf(wolf.pawBL.rotation)
  gsap.killTweensOf(wolf.pawBR.rotation)

  gsap.killTweensOf(wolf.tail.rotation)
  gsap.killTweensOf(wolf.head.rotation)
  gsap.killTweensOf(wolf.eyeL.scale)
  gsap.killTweensOf(wolf.eyeR.scale)

  wolf.tail.rotation.y = 0

  TweenMax.to(camera.position, 3, {
    z: cameraPosGame,
    x: 0,
    y: 30,
    ease: Power4.easeInOut
  })
  TweenMax.to(wolf.torso.rotation, 2, { x: 0, ease: Power4.easeInOut })
  TweenMax.to(wolf.torso.position, 2, { y: 0, ease: Power4.easeInOut })
  TweenMax.to(wolf.pawFL.rotation, 2, { x: 0, ease: Power4.easeInOut })
  TweenMax.to(wolf.pawFR.rotation, 2, { x: 0, ease: Power4.easeInOut })
  TweenMax.to(wolf.mouth.rotation, 2, { x: 0.5, ease: Power4.easeInOut })

  TweenMax.to(wolf.head.rotation, 2, { y: 0, x: -0.3, ease: Power4.easeInOut })

  TweenMax.to(rabbit.mesh.position, 2, { x: 20, ease: Power4.easeInOut })
  TweenMax.to(rabbit.head.rotation, 2, { x: 0, y: 0, ease: Power4.easeInOut })
  TweenMax.to(wolf.mouth.rotation, 2, { x: 0.2, ease: Power4.easeInOut })
  TweenMax.to(wolf.mouth.rotation, 1, {
    x: 0.4,
    ease: Power4.easeIn,
    delay: 1,
    onComplete: function () {
      resetGame()
    }
  })
}

export { initializer, unmount }
