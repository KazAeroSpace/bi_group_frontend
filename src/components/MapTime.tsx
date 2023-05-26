import { type FC, useCallback, useMemo, useState, useTransition } from 'react'
import { getTrackBackground, Range } from 'react-range'
import { Box } from './Box'
import { useSceneView } from './ArcGisMap'
import { DateTime } from 'luxon'
import styled from '@emotion/styled'

const STEP = 1
const MIN = 0
const MAX = 23

const START_OF_DAY = DateTime.local().startOf('day')

const TimeText = styled.span`
  display: block;
  font-weight: 500;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.6);
`

export const MapTime: FC = () => {
  const [values, setValues] = useState<number[]>([DateTime.local().get('hour')])
  const sceneView = useSceneView()
  const [, startTransition] = useTransition()
  const handleSetValues = useCallback((values: number[]) => {
    setValues(values)
    startTransition(() => {
      const currentTime = START_OF_DAY.set({ hour: values[0] }).toJSDate()
      // @ts-expect-error
      sceneView.environment.lighting = {
        date: currentTime,
        directShadowsEnabled: true
      }
    })
  }, [setValues, startTransition])
  const currentTime = useMemo(() => {
    return START_OF_DAY.set({ hour: values[0] }).toLocaleString(DateTime.TIME_24_SIMPLE)
  }, [values])
  return (
      <Box
        style={{
          width: 300,
          padding: 10
        }}
      >
          <TimeText style={{ fontWeight: 400, color: 'black' }}>
              Time Changing
          </TimeText>
          <TimeText>
              {currentTime}
          </TimeText>
          <Range
              values={values}
              step={STEP}
              min={MIN}
              max={MAX}
              onChange={handleSetValues}
              renderTrack={({ props, children }) => (
                  <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      style={{
                        ...props.style,
                        height: 25,
                        display: 'flex',
                        width: '100%'
                      }}
                    >
                      <Box
                          ref={props.ref}
                          style={{
                            height: '5px',
                            width: '100%',
                            borderRadius: 16,
                            backdropFilter: 'blur(5px)',
                            background: getTrackBackground({
                              values,
                              colors: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)'],
                              min: MIN,
                              max: MAX
                            }),
                            alignSelf: 'center'
                          }}
                      >
                        {children}
                      </Box>
                    </div>
              )}
                renderThumb={({ props }) => (
                    <Box
                        {...props}
                        style={{
                          ...props.style,
                          height: 20,
                          width: 20
                        }}
                    />
                )}
            />
      </Box>
  )
}
