import { StateCreator } from 'zustand'

export type SliceCreatorWithImmer<DependentSlice, ResultSlice> = StateCreator<
  DependentSlice,
  [['zustand/immer', never]],
  [],
  ResultSlice
>
