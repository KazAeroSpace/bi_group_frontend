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

const Title = styled.h5`
  font-weight: 500;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
`
export const MapLayerList = memo(() => {
  const dispatch = useDispatch()
  const groupLayersData = useSelector(groupLayersDataSelector)
  const groupsData = useSelector(groupsDataSelector)
  const visibleLayersIds = useSelector(visibleLayersIdsSelector)
  const handleChangeVisibleLayer = useCallback((id: number, event: ChangeEvent<HTMLInputElement>) => {
    event.target.checked
      ? dispatch(addVisibleLayer(id))
      : dispatch(removeVisibleLayer(id))
  }, [])
  return (
        <Box
            style={{
              width: 300,
              height: 500,
              overflowY: 'auto',
              padding: 10
            }}
        >
            {groupLayersData.map(([groupId, layers]) => (
                <Fragment key={groupId}>
                    <div style={{ marginBottom: 10 }}>
                        <Title>
                            {groupsData.find(group => group.id === groupId)?.attributes.title ?? 'UnGrouped'}
                        </Title>
                    </div>
                    {layers.map(layer => (
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
            ))}
        </Box>
  )
})
