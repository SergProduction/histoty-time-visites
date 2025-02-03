import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import iconDefaultHref from '../../assets/icon-default.svg'

type Props = {
  href?: string | null
}

export function Image(props: Props) {
  const [isErrorImg, setErrorImg] = useState(false)

  const handleFallback = useCallback(() => {
    if (!isErrorImg) {
      setErrorImg(true)
    }
  }, [isErrorImg])

  return (
    <DivStyle>
      <img
        src={isErrorImg ? iconDefaultHref : (props.href || iconDefaultHref)}
        className='icon'
        onError={handleFallback}
        alt="icon"
      />
    </DivStyle>
  )
}

const DivStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    width: 16px;
    height: 16px;
    background: #eee;
    margin-right: 8px;
  }
`
