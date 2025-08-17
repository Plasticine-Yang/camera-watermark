import { invoke } from '@tauri-apps/api/core'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readFile, writeFile } from '@tauri-apps/plugin-fs'
import { FC, memo, useRef, useState } from 'react'

export const AddWatermarkToImageDemo: FC = memo(() => {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const [data, setData] = useState<number[]>([])

  async function selectImageFile() {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Image',
            extensions: ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'raw', 'cr2', 'nef', 'arw'],
          },
        ],
      })

      if (selected) {
        const filePath = typeof selected === 'string' ? selected : selected[0]
        console.log('Selected file:', filePath)
        setSelectedFilePath(filePath)

        // 读取文件内容
        const fileContents = await readFile(filePath)
        const blob = new Blob([fileContents])
        const dataUrl = URL.createObjectURL(blob)
        setImageDataUrl(dataUrl)
      }
    } catch (error) {
      console.error('Error selecting image:', error)
    }
  }

  async function addWatermarkAndPreview() {
    if (!selectedFilePath) return

    setIsProcessing(true)
    try {
      // 使用Rust命令添加水印
      const result = await invoke('add_watermark_preserve_exif', {
        request: {
          file_path: selectedFilePath,
          text: 'plasticine',
          color: [255, 0, 0, 178], // 红色，透明度70%
          position: 'bottom-center',
          font_size: 48,
        },
      })

      const { data, format } = result as { data: number[]; format: string }

      // 创建预览
      const blob = new Blob([new Uint8Array(data)], { type: `image/${format}` })
      const dataUrl = URL.createObjectURL(blob)
      setImageDataUrl(dataUrl)
      setData(data)

      console.log('Watermark added, format:', format)
    } catch (error) {
      console.error('Error adding watermark:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  async function saveImageWithWatermark() {
    if (!selectedFilePath) return

    try {
      // 获取原始文件扩展名
      const originalExtension = selectedFilePath.split('.').pop()?.toLowerCase() || 'jpg'

      // 选择保存位置
      const savePath = await save({
        filters: [
          {
            name: 'Image',
            extensions: [originalExtension],
          },
        ],
        defaultPath: `watermarked-image.${originalExtension}`,
      })

      if (savePath) {
        await writeFile(savePath, new Uint8Array(data))
        console.log('Image saved successfully:', savePath)
      }
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  return (
    <div>
      <div className="row">
        <button type="button" onClick={selectImageFile}>
          Select Image File
        </button>

        {selectedFilePath && (
          <>
            <button type="button" onClick={addWatermarkAndPreview} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Preview with Watermark'}
            </button>

            <button type="button" onClick={saveImageWithWatermark}>
              Save with Watermark
            </button>
          </>
        )}
      </div>

      <div>
        <span>image render:</span>
        {imageDataUrl && (
          <div>
            <img
              ref={imgRef}
              src={imageDataUrl}
              alt="Selected Image"
              style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
            />
          </div>
        )}
      </div>
    </div>
  )
})
