import { open } from '@tauri-apps/plugin-dialog'
import { useCallback } from 'react'

import { ImageItem } from '@/types'

interface UseSelectImageProps {
  onAppendImageItemList: (imageItemList: ImageItem[]) => void
}

export function useSelectImage(props: UseSelectImageProps) {
  const { onAppendImageItemList } = props

  const handleSelectImage = useCallback(async () => {
    const selectedImageFilePath = await open({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['jpg', 'jpeg', 'png'],
        },
      ],
    })

    if (selectedImageFilePath === null) {
      return
    }

    onAppendImageItemList(selectedImageFilePath.map((filePath) => ({ filePath })))
  }, [])

  return { handleSelectImage }
}
