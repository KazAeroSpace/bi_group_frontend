import styled from 'styled-components'

export const IconButton = styled.div`
  user-select: none;
  inset: 0;
  width: inherit;
  height: inherit;
  transition: 250ms;
  transform-style: preserve-3d;
  transform-origin: top left;
  position: relative;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;

  svg.frame {
    width: inherit;
    height: inherit;

    rect {
      width: inherit;
      height: inherit;
      fill: none;
      stroke-width: 4;
    }
  }

  svg.icon {
    position: absolute;
    inset: 50% 0 0 50%;
    transform: translate(-50%, -50%);
  }
  
  img {
    width: inherit;
    height: inherit;
    position: absolute;
    inset: 50% 0 0 50%;
    transform: translate(-50%, -50%);
  }
`
