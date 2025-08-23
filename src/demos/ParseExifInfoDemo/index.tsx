import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { memo, useState, type FC } from 'react'

export const ParseParseExifInfoDemoExifInfoDemo: FC = memo(() => {
  const [debugInfo, setDebugInfo] = useState('')
  const [fileName, setFileName] = useState<string>('')
  const [exifInfo, setExifInfo] = useState<any>(null)

  async function selectImageFile() {
    try {
      // 选择图片文件
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
        setFileName(filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown')

        // 读取照片的 EXIF 信息
        const metadataJson = await invoke('parse_exif_info', { filePath })
        const metadata = JSON.parse(metadataJson as string)
        setExifInfo(metadata)
        console.log('Photo metadata:', metadata)

        setDebugInfo(`Successfully loaded photo metadata for ${fileName}`)
      }
    } catch (error) {
      console.error('Error selecting image:', error)
      setDebugInfo(`Error: ${error}`)
    }
  }

  return (
    <main className="container">
      <p>{debugInfo}</p>

      <div className="row">
        <button type="button" onClick={selectImageFile}>
          Select Image File
        </button>
      </div>

      {fileName && (
        <div>
          <h3>Selected file: {fileName}</h3>
        </div>
      )}

      {exifInfo && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Photo EXIF Information:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px' }}>
            <div>
              <strong>Camera:</strong> {exifInfo.camera_model || 'Unknown'}
            </div>
            <div>
              <strong>Lens:</strong> {exifInfo.lens_model || 'Unknown'}
            </div>
            <div>
              <strong>Focal Length:</strong> {exifInfo.focal_length || 'Unknown'} mm
            </div>
            <div>
              <strong>Exposure Time:</strong> {exifInfo.exposure_time || 'Unknown'} s
            </div>
            <div>
              <strong>F-Number:</strong> f/{exifInfo.f_number || 'Unknown'}
            </div>
            <div>
              <strong>ISO:</strong> {exifInfo.iso || 'Unknown'}
            </div>
            <div>
              <strong>Date Taken:</strong> {exifInfo.date_time_original || exifInfo.date_time || 'Unknown'}
            </div>
          </div>
          <details style={{ marginTop: '10px' }}>
            <summary>View Raw EXIF Data</summary>
            <pre
              style={{
                maxHeight: '300px',
                overflow: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                fontSize: '12px',
              }}
            >
              {JSON.stringify(exifInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </main>
  )
})
