import { readFile, ReadFileOptions } from '@tauri-apps/plugin-fs'

export async function readFileToObjectUrl(filePath: string, options?: ReadFileOptions) {
  try {
    const fileContents = await readFile(filePath, options)
    const blob = new Blob([fileContents])
    const objectUrl = URL.createObjectURL(blob)

    return objectUrl
  } catch (error) {
    console.error('readFileToObjectUrl error', error)

    return ''
  }
}
