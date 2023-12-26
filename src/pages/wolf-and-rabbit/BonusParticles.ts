import * as THREE from 'three'
import { greenMat, pinkMat } from './materials'

export default class BonusParticles {
  mesh: THREE.Group
  parts: THREE.Mesh[]

  constructor() {
    this.mesh = new THREE.Group()
    const bigParticleGeom = new THREE.BoxGeometry(10, 10, 10, 1)
    const smallParticleGeom = new THREE.BoxGeometry(5, 5, 5, 1)
    this.parts = []
    for (let i = 0; i < 10; i++) {
      const partPink = new THREE.Mesh(bigParticleGeom, pinkMat)
      const partGreen = new THREE.Mesh(smallParticleGeom, greenMat)
      partGreen.scale.set(0.5, 0.5, 0.5)
      this.parts.push(partPink)
      this.parts.push(partGreen)
      this.mesh.add(partPink)
      this.mesh.add(partGreen)
    }
  }
}
