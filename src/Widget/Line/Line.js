import React from 'react'
import { LineChart, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { isServer } from '../../util/utils'

if (isServer()) {
  console.log("i'm Line and i'm server")
} else {
  console.log("i'm Line and i'm client")
}

function Line() {
  return <div>I am a line chart widget</div>
}

export default Line