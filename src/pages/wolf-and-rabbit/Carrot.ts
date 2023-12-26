import * as THREE from 'three'
import { updateGeomVertex } from '../../helpers'
import { greenMat, pinkMat } from './materials'

export default class Carrot {
  angle: number
  mesh: THREE.Group
  body: THREE.Mesh
  leaf1: THREE.Mesh
  leaf2: THREE.Mesh

  constructor() {
    this.angle = 0
    this.mesh = new THREE.Group()

    const bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1)
    const bodyGeomPositions = bodyGeom.attributes.position
    updateGeomVertex(bodyGeomPositions, 8, undefined, 2)
    updateGeomVertex(bodyGeomPositions, 9, undefined, -3)
    bodyGeomPositions.needsUpdate = true

    this.body = new THREE.Mesh(bodyGeom, pinkMat)

    const leafGeom = new THREE.BoxGeometry(5, 10, 1, 1)
    leafGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 5, 0))
    const leafGeomPositions = leafGeom.attributes.position
    updateGeomVertex(leafGeomPositions, 2, -1)
    updateGeomVertex(leafGeomPositions, 3, -1)
    updateGeomVertex(leafGeomPositions, 6, 1)
    updateGeomVertex(leafGeomPositions, 7, 1)
    leafGeomPositions.needsUpdate = true

    this.leaf1 = new THREE.Mesh(leafGeom, greenMat)
    this.leaf1.position.y = 7
    this.leaf1.rotation.z = 0.3
    this.leaf1.rotation.x = 0.2

    this.leaf2 = this.leaf1.clone()
    this.leaf2.scale.set(1, 1.3, 1)
    this.leaf2.position.y = 7
    this.leaf2.rotation.z = -0.3
    this.leaf2.rotation.x = -0.2

    this.mesh.add(this.body)
    this.mesh.add(this.leaf1)
    this.mesh.add(this.leaf2)

    this.body.traverse(function (object) {
      if ((object as THREE.Mesh).isMesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}
