import { RefObject } from 'react'

import { ImagePreviewerProps } from '../../types'

export type UseRenderCanvasProps = Pick<ImagePreviewerProps, 'imageItem'> & {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement
  canvasContext: CanvasRenderingContext2D
}

export type RenderCanvasFn = (options: RenderCanvasOptions) => Promise<void>
