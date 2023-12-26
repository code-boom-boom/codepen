import * as THREE from 'three'
import { TweenMax } from 'gsap'
import { blackMat, lightBrownMat, whiteMat } from './materials'

type Status = 'ready'

export default class Hedgehog {
  angle: number
  status: Status
  mesh: THREE.Group
  body: THREE.Mesh
  head: THREE.Mesh
  nose: THREE.Mesh
  eyeL: THREE.Mesh
  iris: THREE.Mesh
  eyeR: THREE.Mesh
  earL: THREE.Mesh
  earR: THREE.Mesh
  mouth: THREE.Mesh

  constructor() {
    this.angle = 0
    this.status = 'ready'
    this.mesh = new THREE.Group()
    const bodyGeom = new THREE.BoxGeometry(6, 6, 6, 1)
    this.body = new THREE.Mesh(bodyGeom, blackMat)

    const headGeom = new THREE.BoxGeometry(5, 5, 7, 1)
    this.head = new THREE.Mesh(headGeom, lightBrownMat)
    this.head.position.z = 6
    this.head.position.y = -0.5

    const noseGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1)
    this.nose = new THREE.Mesh(noseGeom, blackMat)
    this.nose.position.z = 4
    this.nose.position.y = 2

    const eyeGeom = new THREE.BoxGeometry(1, 3, 3)

    this.eyeL = new THREE.Mesh(eyeGeom, whiteMat)
    this.eyeL.position.x = 2.2
    this.eyeL.position.z = -0.5
    this.eyeL.position.y = 0.8
    this.eyeL.castShadow = true
    this.head.add(this.eyeL)

    const irisGeom = new THREE.BoxGeometry(0.5, 1, 1)

    this.iris = new THREE.Mesh(irisGeom, blackMat)
    this.iris.position.x = 0.5
    this.iris.position.y = 0.8
    this.iris.position.z = 0.8
    this.eyeL.add(this.iris)

    this.eyeR = this.eyeL.clone()
    this.eyeR.children[0].position.x = -this.iris.position.x
    this.eyeR.position.x = -this.eyeL.position.x

    const spikeGeom = new THREE.BoxGeometry(0.5, 2, 0.5, 1)
    spikeGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0))

    for (let i = 0; i < 9; i++) {
      const row = i % 3
      const col = Math.floor(i / 3)
      const sb = new THREE.Mesh(spikeGeom, blackMat)
      sb.rotation.x = -Math.PI / 2 + (Math.PI / 12) * row - 0.5 + Math.random()
      sb.position.z = -3
      sb.position.y = -2 + row * 2
      sb.position.x = -2 + col * 2
      this.body.add(sb)
      const st = new THREE.Mesh(spikeGeom, blackMat)
      st.position.y = 3
      st.position.x = -2 + row * 2
      st.position.z = -2 + col * 2
      st.rotation.z = Math.PI / 6 - (Math.PI / 6) * row - 0.5 + Math.random()
      this.body.add(st)

      const sr = new THREE.Mesh(spikeGeom, blackMat)
      sr.position.x = 3
      sr.position.y = -2 + row * 2
      sr.position.z = -2 + col * 2
      sr.rotation.z = -Math.PI / 2 + (Math.PI / 12) * row - 0.5 + Math.random()
      this.body.add(sr)

      const sl = new THREE.Mesh(spikeGeom, blackMat)
      sl.position.x = -3
      sl.position.y = -2 + row * 2
      sl.position.z = -2 + col * 2
      sl.rotation.z = Math.PI / 2 - (Math.PI / 12) * row - 0.5 + Math.random()

      this.body.add(sl)
    }

    this.head.add(this.eyeR)
    const earGeom = new THREE.BoxGeometry(2, 2, 0.5, 1)
    this.earL = new THREE.Mesh(earGeom, lightBrownMat)
    this.earL.position.x = 2.5
    this.earL.position.z = -2.5
    this.earL.position.y = 2.5
    this.earL.rotation.z = -Math.PI / 12
    this.earL.castShadow = true
    this.head.add(this.earL)

    this.earR = this.earL.clone()
    this.earR.position.x = -this.earL.position.x
    this.earR.rotation.z = -this.earL.rotation.z
    this.earR.castShadow = true
    this.head.add(this.earR)

    const mouthGeom = new THREE.BoxGeometry(1, 1, 0.5, 1)
    this.mouth = new THREE.Mesh(mouthGeom, blackMat)
    this.mouth.position.z = 3.5
    this.mouth.position.y = -1.5
    this.head.add(this.mouth)

    this.mesh.add(this.body)
    this.body.add(this.head)
    this.head.add(this.nose)

    this.mesh.traverse(function (object) {
      if ((object as THREE.Mesh).isMesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }

  nod() {
    const _this = this
    const speed = 0.1 + Math.random() * 0.5
    const angle = -Math.PI / 4 + (Math.random() * Math.PI) / 2
    TweenMax.to(this.head.rotation, speed, {
      y: angle,
      onComplete: function () {
        _this.nod()
      }
    })
  }
}
