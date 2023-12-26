import * as THREE from 'three'
import Trunc from './Trunc'

export default class Tree {
  mesh: THREE.Object3D
  trunc: Trunc

  constructor() {
    this.mesh = new THREE.Object3D()
    this.trunc = new Trunc()
    this.mesh.add(this.trunc.mesh)
  }
}
