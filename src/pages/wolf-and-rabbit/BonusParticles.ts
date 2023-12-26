import * as THREE from 'three'
import { greenMat, pinkMat } from './materials'
import { TweenMax, Power4 } from 'gsap'

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

  expose() {
    const explosionSpeed = 0.5
    for (let i = 0; i < this.parts.length; i++) {
      const tx = -50 + Math.random() * 100
      const ty = -50 + Math.random() * 100
      const tz = -50 + Math.random() * 100
      const p = this.parts[i]
      p.position.set(0, 0, 0)
      p.scale.set(1, 1, 1)
      p.visible = true
      const s = explosionSpeed + Math.random() * 0.5
      TweenMax.to(p.position, s, { x: tx, y: ty, z: tz, ease: Power4.easeOut })
      TweenMax.to(p.scale, s, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        ease: Power4.easeOut,
        onComplete: () => {
          p.visible = false
        },
        onCompleteParams: [p]
      })
    }
  }
}
