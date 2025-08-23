import { type } from '@tauri-apps/plugin-os'

import { DeviceType } from '@/enums'

export function getDeviceType() {
  const osType = type()

  switch (osType) {
    case 'android':
    case 'ios':
      return DeviceType.Mobile

    case 'linux':
    case 'macos':
    case 'windows':
      return DeviceType.Pc

    default:
      return DeviceType.Unknown
  }
}
