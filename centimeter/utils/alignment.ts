export interface SnapGuide {
  position: number
  orientation: 'horizontal' | 'vertical'
  type: 'edge' | 'center'
}

export interface SnapResult {
  x: number
  y: number
  guides: SnapGuide[]
  highlightedComponentIds: string[]
}

const SNAP_THRESHOLD =  .25
export function findSnapPositions(
  movingComponent: { x: number; y: number; width: number; height: number },
  otherComponents: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  canvasWidth: number = 100,
  canvasHeight: number = 100
): SnapResult {
  const guides: SnapGuide[] = []
  const highlightedComponentIds: string[] = []
  let snappedX = movingComponent.x
  let snappedY = movingComponent.y

  const moving = {
    left: movingComponent.x,
    right: movingComponent.x + movingComponent.width,
    centerX: movingComponent.x + movingComponent.width / 2,
    top: movingComponent.y,
    bottom: movingComponent.y + movingComponent.height,
    centerY: movingComponent.y + movingComponent.height / 2
  }

  const canvasPoints = {
    centerX: canvasWidth / 2,
    centerY: canvasHeight / 2,
    left: 0,
    right: canvasWidth,
    top: 0,
    bottom: canvasHeight
  }

  if (Math.abs(moving.centerX - canvasPoints.centerX) < SNAP_THRESHOLD) {
    snappedX = canvasPoints.centerX - movingComponent.width / 2
    guides.push({ position: canvasPoints.centerX, orientation: 'vertical', type: 'center' })
  }

  if (Math.abs(moving.centerY - canvasPoints.centerY) < SNAP_THRESHOLD) {
    snappedY = canvasPoints.centerY - movingComponent.height / 2
    guides.push({ position: canvasPoints.centerY, orientation: 'horizontal', type: 'center' })
  }

  for (const other of otherComponents) {
    const otherEdges = {
      left: other.x,
      right: other.x + other.width,
      centerX: other.x + other.width / 2,
      top: other.y,
      bottom: other.y + other.height,
      centerY: other.y + other.height / 2
    }

    let snappedToThis = false

    if (Math.abs(moving.left - otherEdges.left) < SNAP_THRESHOLD) {
      snappedX = otherEdges.left
      guides.push({ position: otherEdges.left, orientation: 'vertical', type: 'edge' })
      snappedToThis = true
    } else if (Math.abs(moving.right - otherEdges.right) < SNAP_THRESHOLD) {
      snappedX = otherEdges.right - movingComponent.width
      guides.push({ position: otherEdges.right, orientation: 'vertical', type: 'edge' })
      snappedToThis = true
    } else if (Math.abs(moving.centerX - otherEdges.centerX) < SNAP_THRESHOLD) {
      snappedX = otherEdges.centerX - movingComponent.width / 2
      guides.push({ position: otherEdges.centerX, orientation: 'vertical', type: 'center' })
      snappedToThis = true
    }

    // Horizontal alignment
    if (Math.abs(moving.top - otherEdges.top) < SNAP_THRESHOLD) {
      snappedY = otherEdges.top
      guides.push({ position: otherEdges.top, orientation: 'horizontal', type: 'edge' })
      snappedToThis = true
    } else if (Math.abs(moving.bottom - otherEdges.bottom) < SNAP_THRESHOLD) {
      snappedY = otherEdges.bottom - movingComponent.height
      guides.push({ position: otherEdges.bottom, orientation: 'horizontal', type: 'edge' })
      snappedToThis = true
    } else if (Math.abs(moving.centerY - otherEdges.centerY) < SNAP_THRESHOLD) {
      snappedY = otherEdges.centerY - movingComponent.height / 2
      guides.push({ position: otherEdges.centerY, orientation: 'horizontal', type: 'center' })
      snappedToThis = true
    }

    if (snappedToThis) {
      highlightedComponentIds.push(other.id)
    }
  }

  return { x: snappedX, y: snappedY, guides, highlightedComponentIds }
}