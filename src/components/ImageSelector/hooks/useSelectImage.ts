import { open } from '@tauri-apps/plugin-dialog'
import { useCallback } from 'react'

import { ImageItem } from '@/types'
import { readFile } from '@tauri-apps/plugin-fs'
import { readFileToObjectUrl } from '@/helpers'

interface UseSelectImageProps {
  onAppendImageItemList: (imageItemList: ImageItem[]) => void
}

export function useSelectImage(props: UseSelectImageProps) {
  const { onAppendImageItemList } = props

  const handleSelectImage = useCallback(async () => {
    const selectedImageFilePathList = await open({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['jpg', 'jpeg', 'png'],
        },
      ],
    })

    if (selectedImageFilePathList === null) {
      return
    }

    const selectedImageItemList = await Promise.all(
      selectedImageFilePathList.map(async (filePath) => {
        const objectUrl = await readFileToObjectUrl(filePath)

        return {
          filePath,
          objectUrl,
        }
      }),
    )

    onAppendImageItemList(selectedImageItemList)
  }, [])

  return { handleSelectImage }
}
