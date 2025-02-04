import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import iconDefaultHref from '../../assets/icon-default.svg'

type Props = {
  href?: string | null
}

export function Settings(props: Props) {

  return (
    <DivStyle>
      <div>
        <h3>Режим концентрации</h3>
        <p>Записывает время посещения только после нахождение на сайте больше установленного времени (по умолчанию 15 сек)</p>
      </div>
      <div>
        <h3>Режим сессии</h3>
        <p>Записывает время посещения только после нахождение на сайте больше установленного времени (по умолчанию 15 сек)</p>
      </div>
    </DivStyle>
  )
}

const DivStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
