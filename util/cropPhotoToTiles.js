import { ImageManipulator } from 'expo'

const createTile = async (photo, row, col, matrixSize) => {
  const dim = (photo.width < photo.height) ? photo.width : photo.height
  const tileDim = dim / matrixSize

  const offsetX = (photo.width > photo.height) ? (photo.width - photo.height) / 2 : 0
  const offsetY = (photo.width < photo.height) ? (photo.height - photo.width) / 2 : 0

  const cropConfig = {
    originX: tileDim * row + offsetX,
    originY: tileDim * col + offsetY,
    width: tileDim,
    height: tileDim
  }

  const result = await ImageManipulator.manipulate(
    photo.uri,
    [
      { flip: { horizontal: true } },
      { crop: cropConfig },
    ],
    { format: 'png' }
  )

  return result
}

const cropPhotoToTiles = async (photo, matrixSize) => {
  const result = []
  for (let row = 0; row < matrixSize; row++) {
    result.push([])
    for (let col = 0; col < matrixSize; col++) {
      const tile = await createTile(photo, row, col, matrixSize)
      result[row].push(tile)
    }
  }
  return result
}

export default cropPhotoToTiles