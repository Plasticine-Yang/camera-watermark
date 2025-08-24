import { useMediaQuery, Breakpoint } from '@mui/material'
import { useMemo } from 'react'

export function useCurrentBreakpoint() {
  const xl = useMediaQuery((theme) => theme.breakpoints.up('xl'))
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const md = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const sm = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const xs = useMediaQuery((theme) => theme.breakpoints.up('xs'))

  const currentBreakPoint = useMemo<Breakpoint>(() => {
    if (xl) {
      return 'xl'
    }

    if (lg) {
      return 'lg'
    }

    if (md) {
      return 'md'
    }

    if (sm) {
      return 'sm'
    }

    if (xs) {
      return 'xs'
    }

    return 'xl'
  }, [lg, md, sm])

  return {
    currentBreakPoint,
  }
}
