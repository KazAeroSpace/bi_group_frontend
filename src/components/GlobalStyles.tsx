import { memo } from 'react'
import { Global, css } from '@emotion/react'

export const GlobalStyles = memo(() => (
    <Global
        styles={css`
              * {
                font-family: 'Rajdhani', sans-serif;
              }
              .esri-view .esri-view-surface--inset-outline:focus::after {
                  outline: none !important;
              }
        `}
    />
))
