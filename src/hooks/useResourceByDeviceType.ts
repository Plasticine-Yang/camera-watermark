import { useMemo } from 'react'

import { DeviceType } from '@/enums'
import { getDeviceType } from '@/helpers'

export interface UseResourceByDeviceTypeProps<PcResourceType, MobileResourceType> {
  pcResourceCreator: () => PcResourceType
  mobileResourceCreator: () => MobileResourceType
}

export const useResourceByDeviceType = <PcResourceType, MobileResourceType>(
  props: UseResourceByDeviceTypeProps<PcResourceType, MobileResourceType>,
) => {
  const { pcResourceCreator, mobileResourceCreator } = props

  const resource = useMemo(() => {
    const deviceType = getDeviceType()

    switch (deviceType) {
      case DeviceType.Mobile:
        return mobileResourceCreator()

      case DeviceType.Pc:
        return pcResourceCreator()

      default:
        return null
    }
  }, [mobileResourceCreator, pcResourceCreator])

  return { resource }
}
