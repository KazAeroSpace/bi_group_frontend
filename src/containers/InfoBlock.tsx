import {
  type FC,
  useCallback,
  useRef
} from 'react'
import {
  clickedLayerItemSelector,
  setClickedLayerItemId
} from '../slices/layerSlice'
import {
  useSelector,
  useDispatch
} from '../store'
import { Box } from '../components/Box'
import styled from 'styled-components'
import {
  type LayerAttribute,
  LayerAttributeType
} from '../types'
import { DateTime } from 'luxon'
import { buildImageUrl } from '../utils'
import { IconButton } from '../components/IconButton'
import { useOnClickOutside } from 'usehooks-ts'
import { useExternalMapState } from '../contexts/ExternalMapState'

const InfoBlockContainer = styled(Box)`
  width: 500px;
  padding: 10px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-height: 90vh;
  overflow-y: auto;
`

const InfoBlockTableContent = styled.div`
  overflow-x:auto;
  margin-top: 0;
`

const InfoBlockTable = styled.table`
  width: 100%;
`

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align:middle;
  font-weight: 400;
  font-size: 20px;
  color: white;
  border-bottom: solid 1px rgba(255,255,255,0.5);
`

const Link = styled.a`
  color: white;
  text-decoration-color: white;
  text-decoration-thickness: from-font;
`

const Title = styled.h5`
  font-weight: 500;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`

const HeadBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const InfoBlock: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const clickedLayerItem = useSelector(clickedLayerItemSelector)
  const { triggerTargetToGo, targetToGo } = useExternalMapState()

  useOnClickOutside(ref, () => {
    dispatch(setClickedLayerItemId(null))
  })

  const getRelevantContent = useCallback((item: LayerAttribute) => {
    switch (item.type) {
      case LayerAttributeType.date:
        return DateTime.fromISO(item.dateValue!).toLocaleString(DateTime.DATE_FULL)
      case LayerAttributeType.string:
        return item.stringValue ?? ''
      case LayerAttributeType.number:
        return item.numberValue?.toString() ?? ''
      case LayerAttributeType.boolean:
        return item.booleanValue ? 'YES' : 'NO'
      case LayerAttributeType.link:
        return <Link target="_blank" href={item.stringValue ?? '#'} rel="noreferrer">Reference</Link>
      default:
        return ''
    }
  }, [])

  if (!clickedLayerItem?.layerAttributes) {
    return null
  }

  return (
      <InfoBlockContainer ref={ref}>
          <HeadBlock>
            <Title>
              {clickedLayerItem.title}
            </Title>
            {targetToGo && (
                <IconButton style={{ height: 15, width: 15 }} onClick={triggerTargetToGo}>
                  <img src="/images/eye-scanner.png" alt="window" />
                </IconButton>
            )}
          </HeadBlock>
          <InfoBlockTableContent>
              <InfoBlockTable cellPadding={0} cellSpacing={0} border={0}>
                  {clickedLayerItem.layerAttributes
                    .filter(item => item.type !== LayerAttributeType.file)
                    .map(item => (
                      <tr key={item.id}>
                          <TableCell>
                              {item.key}
                          </TableCell>
                          <TableCell align="right">
                              {getRelevantContent(item)}
                          </TableCell>
                      </tr>
                    ))}
              </InfoBlockTable>
          </InfoBlockTableContent>
          {clickedLayerItem.layerAttributes
            .filter(item => item.type === LayerAttributeType.file && item.file?.data)
            .map(item => (
                <img
                    key={item.id}
                    style={{ width: '100%', marginTop: 10 }}
                    src={buildImageUrl(item.file!.data!.attributes)}
                    alt={item.file!.data?.attributes.name}
                />
            ))
          }
      </InfoBlockContainer>
  )
}
