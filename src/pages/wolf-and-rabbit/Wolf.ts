import * as THREE from 'three'
import { blackMat, pinkMat, whiteMat } from './materials'
import { updateGeomVertex } from '../../helpers'

export default class Wolf {
  runningCycle: number
  mesh: THREE.Group
  body: THREE.Group
  torso: THREE.Mesh
  head: THREE.Mesh
  mouth: THREE.Mesh
  rabbitHolder: THREE.Group
  tongue: THREE.Mesh
  nose: THREE.Mesh
  eyeL: THREE.Mesh
  iris: THREE.Mesh
  eyeR: THREE.Mesh
  earL: THREE.Mesh
  earR: THREE.Mesh
  tail: THREE.Mesh
  pawFL: THREE.Mesh
  pawFR: THREE.Mesh
  pawBL: THREE.Mesh
  pawBR: THREE.Mesh
  delta: number = 0
  speed: number = 0
  maxSpeed: number = 0

  constructor() {
    this.runningCycle = 0
    this.mesh = new THREE.Group()
    this.body = new THREE.Group()

    const torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1)
    this.torso = new THREE.Mesh(torsoGeom, blackMat)

    const headGeom = new THREE.BoxGeometry(20, 20, 40, 1)
    headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 20))
    this.head = new THREE.Mesh(headGeom, blackMat)
    this.head.position.z = 12
    this.head.position.y = 2

    const mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1)
    mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -2, 10))
    this.mouth = new THREE.Mesh(mouthGeom, blackMat)
    this.mouth.position.y = -8
    this.mouth.rotation.x = 0.4
    this.mouth.position.z = 4

    this.rabbitHolder = new THREE.Group()
    this.rabbitHolder.position.z = 20
    this.mouth.add(this.rabbitHolder)

    const toothGeom = new THREE.BoxGeometry(2, 2, 1, 1)

    const toothGeomPositions = toothGeom.attributes.position

    updateGeomVertex(toothGeomPositions, 1, -1)
    updateGeomVertex(toothGeomPositions, 4, 1)
    updateGeomVertex(toothGeomPositions, 5, 1)
    updateGeomVertex(toothGeomPositions, 0, -1)

    toothGeomPositions.needsUpdate = true

    for (let i = 0; i < 3; i++) {
      const toothF = new THREE.Mesh(toothGeom, whiteMat)
      toothF.position.x = -2.8 + i * 2.5
      toothF.position.y = 1
      toothF.position.z = 19

      const toothL = new THREE.Mesh(toothGeom, whiteMat)
      toothL.rotation.y = Math.PI / 2
      toothL.position.z = 12 + i * 2.5
      toothL.position.y = 1
      toothL.position.x = 4

      const toothR = toothL.clone()
      toothR.position.x = -4

      this.mouth.add(toothF)
      this.mouth.add(toothL)
      this.mouth.add(toothR)
    }

    const tongueGeometry = new THREE.BoxGeometry(6, 1, 14)
    tongueGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7))

    this.tongue = new THREE.Mesh(tongueGeometry, pinkMat)
    this.tongue.position.z = 2
    this.tongue.rotation.x = -0.2
    this.mouth.add(this.tongue)

    const noseGeom = new THREE.BoxGeometry(4, 4, 4, 1)
    this.nose = new THREE.Mesh(noseGeom, pinkMat)
    this.nose.position.z = 39.5
    this.nose.position.y = 9
    this.head.add(this.nose)

    this.head.add(this.mouth)

    const eyeGeom = new THREE.BoxGeometry(2, 3, 3)

    this.eyeL = new THREE.Mesh(eyeGeom, whiteMat)
    this.eyeL.position.x = 10
    this.eyeL.position.z = 5
    this.eyeL.position.y = 5
    this.eyeL.castShadow = true
    this.head.add(this.eyeL)

    const irisGeom = new THREE.BoxGeometry(0.6, 1, 1)

    this.iris = new THREE.Mesh(irisGeom, blackMat)
    this.iris.position.x = 1.2
    this.iris.position.y = -1
    this.iris.position.z = 1
    this.eyeL.add(this.iris)

    this.eyeR = this.eyeL.clone()
    this.eyeR.children[0].position.x = -this.iris.position.x
    this.eyeR.position.x = -this.eyeL.position.x
    this.head.add(this.eyeR)

    const earGeom = new THREE.BoxGeometry(8, 6, 2, 1)

    const earGeomPositions = earGeom.attributes.position

    updateGeomVertex(earGeomPositions, 1, -4)
    updateGeomVertex(earGeomPositions, 4, 4)
    updateGeomVertex(earGeomPositions, 5, 4, undefined, -2)
    updateGeomVertex(earGeomPositions, 0, -4, undefined, -2)

    earGeomPositions.needsUpdate = true

    earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 3, 0))

    this.earL = new THREE.Mesh(earGeom, blackMat)
    this.earL.position.x = 6
    this.earL.position.z = 1
    this.earL.position.y = 10
    this.earL.castShadow = true
    this.head.add(this.earL)

    this.earR = this.earL.clone()
    this.earR.position.x = -this.earL.position.x
    this.earR.rotation.z = -this.earL.rotation.z
    this.head.add(this.earR)

    const tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1)
    tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0))
    tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4))

    this.tail = new THREE.Mesh(tailGeom, blackMat)
    this.tail.position.z = -10
    this.tail.position.y = 4
    this.torso.add(this.tail)

    const pawGeom = new THREE.CylinderGeometry(1.5, 0, 10)
    pawGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5, 0))
    this.pawFL = new THREE.Mesh(pawGeom, blackMat)
    this.pawFL.position.y = -7.5
    this.pawFL.position.z = 8.5
    this.pawFL.position.x = 5.5
    this.torso.add(this.pawFL)

    this.pawFR = this.pawFL.clone()
    this.pawFR.position.x = -this.pawFL.position.x
    this.torso.add(this.pawFR)

    this.pawBR = this.pawFR.clone()
    this.pawBR.position.z = -this.pawFL.position.z
    this.torso.add(this.pawBR)

    this.pawBL = this.pawBR.clone()
    this.pawBL.position.x = this.pawFL.position.x
    this.torso.add(this.pawBL)

    this.mesh.add(this.body)
    this.torso.add(this.head)
    this.body.add(this.torso)

    this.torso.castShadow = true
    this.head.castShadow = true
    this.pawFL.castShadow = true
    this.pawFR.castShadow = true
    this.pawBL.castShadow = true
    this.pawBR.castShadow = true

    this.body.rotation.y = Math.PI / 2
  }

  run() {
    const s = Math.min(this.speed, this.maxSpeed)
    this.runningCycle += this.delta * s * 0.7
    this.runningCycle = this.runningCycle % (Math.PI * 2)
    const t = this.runningCycle

    this.pawFR.rotation.x = (Math.sin(t) * Math.PI) / 4
    this.pawFR.position.y = -5.5 - Math.sin(t)
    this.pawFR.position.z = 7.5 + Math.cos(t)

    this.pawFL.rotation.x = (Math.sin(t + 0.4) * Math.PI) / 4
    this.pawFL.position.y = -5.5 - Math.sin(t + 0.4)
    this.pawFL.position.z = 7.5 + Math.cos(t + 0.4)

    this.pawBL.rotation.x = (Math.sin(t + 2) * Math.PI) / 4
    this.pawBL.position.y = -5.5 - Math.sin(t + 3.8)
    this.pawBL.position.z = -7.5 + Math.cos(t + 3.8)

    this.pawBR.rotation.x = (Math.sin(t + 2.4) * Math.PI) / 4
    this.pawBR.position.y = -5.5 - Math.sin(t + 3.4)
    this.pawBR.position.z = -7.5 + Math.cos(t + 3.4)

    this.torso.rotation.x = (Math.sin(t) * Math.PI) / 8
    this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3

    //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
    this.head.rotation.x = -0.1 + Math.sin(-t - 1) * 0.4
    this.mouth.rotation.x = 0.2 + Math.sin(t + Math.PI + 0.3) * 0.4

    this.tail.rotation.x = 0.2 + Math.sin(t - Math.PI / 2)

    this.eyeR.scale.y = 0.5 + Math.sin(t + Math.PI) * 0.5
  }
}
