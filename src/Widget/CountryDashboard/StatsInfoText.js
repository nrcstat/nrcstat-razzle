import React, { useContext } from 'react'
import { FixedLocaleContext } from '../../services/i18n'
import { isServer } from '../../util/utils'
import c from './StatsInfoText.module.scss'

export function StatsInfoText() {
  if (isServer()) return null

  const { getNsFixedT } = useContext(FixedLocaleContext)

  const t = getNsFixedT(['Widget.Static.CountryDashboard'])

  return (
    <>
      <p className={c['footnote']} style={{ marginBottom: '-0.5em' }}>
        {t('legend.numbersApplyAtEntryToEachCalendarYear')}
      </p>
      <p className={c['footnote']} style={{ marginBottom: '5px' }}>
        {t('legend.sources')}
      </p>
    </>
  )
}
