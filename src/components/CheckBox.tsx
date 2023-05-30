import { memo } from 'react'
import styled from 'styled-components'

const Checkmark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 3px;
    height: 8px;
    border: solid white;
    background: transparent;
    border-width: 0 2px 2px 0;
  }
`

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  border-radius: 6px;
  background-color: transparent;
  &:checked ~ ${Checkmark} {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  &:checked ~ ${Checkmark}:after {
    display: block;
  }
  &:disabled ~ ${Checkmark} {
    background-color: rgba(255, 255, 255, 0.6);
  }
`

const Container = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 15px;
  user-select: none;
  color: white;
  padding-top: 2.5px;
`

interface Props {
  label?: string
}

export const CheckBox = memo<Props & Record<string, any>>((props) => {
  const { label, ...other } = props
  return (
      <Container>
          {label}
          <Input {...other} />
          <Checkmark />
      </Container>
  )
})
