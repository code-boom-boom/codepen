import * as THREE from 'three'
import Rabbit from './Rabbit'
import Wolf from './Wolf'

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
const speed = 6
const distance = 0
const level = 1
let levelInterval
const levelUpdateFreq = 3000
const initSpeed = 5
const maxSpeed = 48
let wolfPos = 0.65
let wolfPosTarget = 0.65
let floorRotation = 0
const collisionObstacle = 10
const collisionBonus = 20
const gameStatus = 'play'
const cameraPosGame = 160
const cameraPosGameOver = 260
const wolfAcceleration = 0.004
const malusClearColor = 0xb44b39
const malusClearAlpha = 0
const audio = new Audio('assets/race.mp3')

let fieldGameOver, fieldDistance

//SCREEN & MOUSE VARIABLES

let HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  }

//3D OBJECTS VARIABLES

let rabbit: Rabbit
let wolf: Wolf

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
  // TODO rabbit.nod()
}

const createWolf = () => {
  wolf = new Wolf()
  wolf.mesh.position.z = 20
  scene.add(wolf.mesh)
  updateWolfPosition()
}

const updateWolfPosition = () => {
  wolf.run()

  wolfPosTarget += delta * wolfAcceleration
  wolfPos += (wolfPosTarget - wolfPos) * delta

  if (wolfPos < 0.56) {
    console.log('game over')
  }

  const angle = Math.PI * wolfPos
  wolf.mesh.position.y = -floorRadius + Math.sin(angle) * (floorRadius + 12)
  wolf.mesh.position.x = Math.cos(angle) * (floorRadius + 15)
  wolf.mesh.rotation.z = -Math.PI / 2 + angle
}

const updateFloorRotation = () => {
  floorRotation += delta * 0.03 * speed
  floorRotation = floorRotation % (Math.PI * 2)
  floor.rotation.z = floorRotation
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
    updateWolfPosition()
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
  loop()
}

const unmount = () => {
}

export { initializer, unmount }
