import * as THREE from 'three'
import { blackMat, brownMat, greenMat, lightBrownMat, pinkMat, whiteMat } from './materials'
import { updateGeomVertex } from '../../helpers'

export default class Trunc {
  mesh: THREE.Mesh

  constructor() {
    const truncHeight = 50 + Math.random() * 150
    const topRadius = 1 + Math.random() * 5
    const bottomRadius = 5 + Math.random() * 5
    const mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat]
    const matTrunc = blackMat
    const nhSegments = 3
    const nvSegments = 3
    const geom = new THREE.CylinderGeometry(topRadius, bottomRadius, truncHeight, nhSegments, nvSegments)
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, truncHeight / 2, 0))

    this.mesh = new THREE.Mesh(geom, matTrunc)

    const positions = this.mesh.geometry.attributes.position

    for (let i = 0; i < positions.array.length; i++) {
      const noise = Math.random()
      updateGeomVertex(positions, i, -noise + Math.random() * 2, -noise + Math.random() * 2, -noise + Math.random() * 2)

      geom.computeVertexNormals()

      // FRUITS
      if (Math.random() > 0.7) {
        const size = Math.random() * 3
        const fruitGeometry = new THREE.BoxGeometry(size, size, size, 1)
        const matFruit = mats[Math.floor(Math.random() * mats.length)]
        const fruit = new THREE.Mesh(fruitGeometry, matFruit)

        fruit.position.x = positions.array[i * 3]
        fruit.position.y = positions.array[i * 3 + 1] + 3
        fruit.position.z = positions.array[i * 3 + 2]
        fruit.rotation.x = Math.random() * Math.PI
        fruit.rotation.y = Math.random() * Math.PI

        this.mesh.add(fruit)
      }

      // BRANCHES
      if (Math.random() > .5 && positions.array[i * 3 + 1] > 10 && positions.array[i * 3 + 1] < truncHeight - 10) {
        const h = 3 + Math.random() * 5
        const thickness = .2 + Math.random()

        const branchGeometry = new THREE.CylinderGeometry(thickness / 2, thickness, h, 3, 1)
        branchGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, h / 2, 0))
        const branch = new THREE.Mesh(branchGeometry, matTrunc)
        branch.position.x = positions.array[i * 3]
        branch.position.y = positions.array[i * 3 + 1]
        branch.position.z = positions.array[i * 3 + 2]

        const vec = new THREE.Vector3(positions.array[i * 3], 2, positions.array[i * 3 + 2])
        const axis = new THREE.Vector3(0, 1, 0)
        branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize())

        this.mesh.add(branch)
      }
    }

    this.mesh.castShadow = true
  }
}
