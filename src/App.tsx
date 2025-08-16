import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

import './App.css'

function App() {
  const [debugInfo, setDebugInfo] = useState('')
  const [fileName, setFileName] = useState<string>('')

  async function selectImageFile() {
    try {
      // 选择图片文件
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Image',
            extensions: ['png', 'jpg', 'jpeg'],
          },
        ],
      })

      if (selected) {
        const filePath = typeof selected === 'string' ? selected : selected[0]
        setFileName(filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown')

        // 对于图片文件，我们通常发送文件路径而不是内容
        // 让Rust后端直接读取文件
        const result = await invoke('process_image', {
          filePath,
        })

        console.log('Image processed:', result)
        setDebugInfo(`Image processed: ${result}`)
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
    </main>
  )
}

export default App
