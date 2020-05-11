import React from 'react'
import { LineChart, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { isServer } from '../../util/utils'

if (isServer()) {
  console.log("i'm Pie and i'm server")
} else {
  console.log("i'm Pie and i'm client")
}

function Pie() {
  return <div>I am a Pie chart widget</div>
}

export default Pie