import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Rajdhani', sans-serif;
  }
  .esri-view .esri-view-surface--inset-outline:focus::after {
    outline: none !important;
  }
`
