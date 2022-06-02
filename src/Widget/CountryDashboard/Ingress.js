import React, { useContext } from 'react'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import { WidgetParamsContext } from '../Widget'
import c from './Ingress.module.scss'

export function Ingress() {
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)
  const widgetParams = useContext(WidgetParamsContext)
  const { countryCode } = widgetParams

  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  let ingress = String(
    t(`countryIngress.${countryCode}`, { defaultValue: '' })
  ).trim()

  const isEmpty = Boolean(ingress)

  return (
    <div className={`${c['ingress']} ${isEmpty ? 'ingress-empty' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>{ingress}</p>
      </div>
    </div>
  )
}
