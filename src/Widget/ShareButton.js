import Facebook from '@mui/icons-material/Facebook'
import Share from '@mui/icons-material/Share'
import Twitter from '@mui/icons-material/Twitter'
import IconButton from '@mui/material/IconButton'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { createGenerateClassName, StylesProvider } from '@mui/styles'
import React, { useState } from 'react'

const generateClassName = createGenerateClassName({
  seed: 'App1',
})

export default function ShareButton({ widgetId }) {
  const [socialMediaOpen, setSocialMediaOpen] = useState(false)

  return (
    <StylesProvider generateClassName={generateClassName}>
      <SpeedDial
        ariaLabel="Share"
        icon={<Share style={{ color: 'white' }} />}
        open={socialMediaOpen}
        onClick={() => setSocialMediaOpen((open) => !open)}
        FabProps={{
          color: 'default',
          size: 'small',
          style: { boxShadow: 'none' },
        }}
      >
        <SpeedDialAction
          icon={
            <FacebookShareButton urlToShare={shareableUrlForWidget(widgetId)} />
          }
          tooltipTitle="Facebook"
        />
        <SpeedDialAction
          icon={
            <TwitterShareButton urlToShare={shareableUrlForWidget(widgetId)} />
          }
          tooltipTitle="Twitter"
        />
      </SpeedDial>
    </StylesProvider>
  )
}

const IconAnchor = React.forwardRef((props, ref) => <a {...props} ref={ref} />)

function FacebookShareButton({ urlToShare }) {
  return (
    <IconButton
      component={IconAnchor}
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlToShare
      )}`}
      target="_blank"
    >
      <Facebook />
    </IconButton>
  )
}

function TwitterShareButton({ urlToShare }) {
  return (
    <IconButton
      component={IconAnchor}
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
        urlToShare
      )}`}
      target="_blank"
    >
      <Twitter />
    </IconButton>
  )
}

function shareableUrlForWidget(widgetId) {
  return `https://share.nrcdata.no/${widgetId}.html?sharedFromUrl=${encodeURIComponent(
    window.location.href
  )}`
}
