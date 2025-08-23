import { memo, type FC } from 'react'

import { useResourceByDeviceType } from '@/hooks'

import { EditImageMobile } from './mobile'
import { EditImagePc } from './pc'

interface EditImageProps {}

export const EditImage: FC<EditImageProps> = memo(() => {
  const { resource } = useResourceByDeviceType({
    pcResourceCreator: () => <EditImagePc />,
    mobileResourceCreator: () => <EditImageMobile />,
  })

  return resource
})
