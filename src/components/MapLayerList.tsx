import {
  type ChangeEvent,
  Fragment,
  memo,
  useCallback
} from 'react'
import { Box } from './Box'
import { useDispatch, useSelector } from '../store'
import {
  addVisibleLayer,
  groupLayersDataSelector,
  groupsDataSelector,
  removeVisibleLayer,
  visibleLayersIdsSelector
} from '../slices/layerSlice'
import styled from 'styled-components'
import { CheckBox } from './CheckBox'
import { type AttributedData, type Layer } from '../types'

const Title = styled.h5`
  font-weight: 500;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`

const GroupBlock = memo<{ groupId: number, layers: Array<AttributedData<Layer>> }>(({ groupId, layers }) => {
  const controlledLayers = layers.filter(layer => layer.attributes.controlled)
  const dispatch = useDispatch()
  const groupsData = useSelector(groupsDataSelector)
  const visibleLayersIds = useSelector(visibleLayersIdsSelector)
  const handleChangeVisibleLayer = useCallback((id: number, event: ChangeEvent<HTMLInputElement>) => {
    event.target.checked
      ? dispatch(addVisibleLayer(id))
      : dispatch(removeVisibleLayer(id))
  }, [])
  if (!controlledLayers.length) {
    return null
  }
  return (
        <Fragment key={groupId}>
            <div style={{ marginBottom: 10 }}>
                <Title>
                    {groupsData.find(group => group.id === groupId)?.attributes.title ?? 'UnGrouped'}
                </Title>
            </div>
            {controlledLayers
              .map(layer => (
                    <CheckBox
                        key={layer.id}
                        label={layer.attributes.title ?? ''}
                        type="checkbox"
                        disabled={!layer.attributes.controlled}
                        checked={visibleLayersIds.includes(layer.id)}
                        onChange={handleChangeVisibleLayer.bind(this, layer.id)}
                    />
              ))}
        </Fragment>
  )
})

export const MapLayerList = memo(() => {
  const groupLayersData = useSelector(groupLayersDataSelector)
  return (
        <Box
            style={{
              width: 300,
              maxHeight: 500,
              overflowY: 'auto',
              padding: 10
            }}
        >
            {groupLayersData.map(([groupId, layers]) => (
                <GroupBlock
                    key={groupId}
                    groupId={groupId}
                    layers={layers}
                />
            ))}
        </Box>
  )
})
