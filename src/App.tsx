import { ThemeProvider } from '@mui/material'

import { theme } from './mui'
import { EditImage } from './pages'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <EditImage />
      </div>
    </ThemeProvider>
  )
}

export default App
