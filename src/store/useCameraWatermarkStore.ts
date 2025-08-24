import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { createImageSelectorSlice } from './slices'
import { CameraWatermarkStore } from './types'

export const useCameraWatermarkStore = create<CameraWatermarkStore>()(
  immer((...args) => ({
    ...createImageSelectorSlice(...args),
  })),
)
