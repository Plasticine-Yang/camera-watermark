import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { memo, type FC } from 'react'

import { ImagePreviewer, ImageSelector } from '@/components'
import { useCurrentBreakpoint } from '@/hooks'

import { useImageSelector } from './hooks'

interface EditImageProps {}

export const EditImage: FC<EditImageProps> = memo(() => {
  const {
    activeImageItem,
    selectedImageItemList,
    handleActiveImageItemChange,
    handleAppendImageItemList,
    handleDeleteImageItem,
  } = useImageSelector()

  const { currentBreakPoint } = useCurrentBreakpoint()

  return (
    <Container maxWidth={currentBreakPoint}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" color="textPrimary" sx={{ flexGrow: 1 }}>
            Camera Watermark
          </Typography>

          <Button color="inherit">导出</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: 10 }}>
        <ImagePreviewer imageItem={activeImageItem} />
      </Box>

      <Box sx={{ marginTop: 10 }}>
        <ImageSelector
          activeImageItem={activeImageItem}
          selectedImageItemList={selectedImageItemList}
          onActiveImageItemChange={handleActiveImageItemChange}
          onAppendImageItemList={handleAppendImageItemList}
          onDeleteImageItem={handleDeleteImageItem}
        />
      </Box>
    </Container>
  )
})
