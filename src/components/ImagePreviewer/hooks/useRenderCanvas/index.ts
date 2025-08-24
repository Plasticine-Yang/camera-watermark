import { useCallback, useEffect } from 'react'

import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'
import { RenderCanvasFn, RenderCanvasOptions, UseRenderCanvasProps } from './types'

export function useRenderCanvas(props: UseRenderCanvasProps) {
  const { imageItem, canvasRef } = props

  const renderImage = useCallback<RenderCanvasFn>(
    async (options) => {
      const { canvas, canvasContext } = options

      if (!imageItem?.objectUrl) {
        return
      }

      const img = new Image()
      img.onload = () => {
        // 计算合适的尺寸，保持宽高比
        const maxWidth = 800
        const maxHeight = 600

        let { width, height } = img

        // 缩放以适应最大尺寸
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // 设置 canvas 尺寸
        canvas.width = width
        canvas.height = height

        // 清除画布
        canvasContext.clearRect(0, 0, width, height)

        // 绘制图片
        canvasContext.drawImage(img, 0, 0, width, height)
      }

      img.src = imageItem?.objectUrl
    },
    [imageItem?.objectUrl],
  )

  const renderWatermark = useCallback<RenderCanvasFn>(async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    try {
      // 加载 SVG 水印
      let svgText
      svgText = await readTextFile('watermark-logos/sony.svg', { baseDir: BaseDirectory.Resource })

      // 创建白色版本的 SVG
      const whiteSvgText = svgText.replace(/fill="[^"]*"/g, 'fill="white"').replace(/stroke="[^"]*"/g, 'stroke="white"')

      // 创建 SVG 的 Blob URL
      const svgBlob = new Blob([whiteSvgText], { type: 'image/svg+xml' })
      const svgUrl = URL.createObjectURL(svgBlob)

      // 加载 SVG 图片
      const watermarkImg = new Image()

      await new Promise((resolve, reject) => {
        watermarkImg.onload = resolve
        watermarkImg.onerror = reject
        watermarkImg.src = svgUrl
      })

      // 计算水印位置和大小（右下角，占图片宽度的10%）
      const watermarkWidth = canvas.width * 0.1
      const scale = watermarkWidth / watermarkImg.width
      const watermarkHeight = watermarkImg.height * scale

      const x = canvas.width - watermarkWidth - 20
      const y = canvas.height - watermarkHeight - 20

      // 绘制白色水印
      ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)

      // 清理 SVG Blob URL
      URL.revokeObjectURL(svgUrl)
    } catch (error) {
      console.error('渲染水印失败:', error)
    }
  }, [canvasRef])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const canvasContext = canvas.getContext('2d')
    if (!canvasContext) return

    const render = async () => {
      try {
        const options: RenderCanvasOptions = { canvas, canvasContext }

        await renderImage(options)
        await renderWatermark(options)
      } catch (error) {
        console.error('render canvas error')
      }
    }

    render()
  }, [imageItem?.objectUrl, renderImage])
}
