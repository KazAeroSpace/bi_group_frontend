import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Rajdhani', sans-serif;
  }
  .esri-view .esri-view-surface--inset-outline:focus::after {
    outline: none !important;
  }
  ::-webkit-scrollbar {
    background: transparent;
    overflow-y: hidden;
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    overflow-y: hidden;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 16px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
    background: rgba(255, 255, 255, 0.4);
  }
`
