import { UnknownProps } from '../types'

export const updateGeomVertex = (
  positions: UnknownProps,
  vertexIndex: number,
  dx: number = 0,
  dy: number = 0,
  dz: number = 0
) => {
  positions.array[vertexIndex * 3] += dx
  positions.array[vertexIndex * 3 + 1] += dy
  positions.array[vertexIndex * 3 + 2] += dz
}
