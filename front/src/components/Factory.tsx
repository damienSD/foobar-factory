import React from 'react'
import * as _ from 'lodash'
import { Chip, Avatar, Typography, Divider } from '@mui/material'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import FactoryIcon from '@mui/icons-material/Factory'
import ChartViewer from './ChartViewer'

const Factory = ({ data = {} }) => {
    const { factory = {}, historic = {}, robots = {} } = data
    const { activity, waiting, message } = factory

    const robotsArray = _.map(robots)
    const foosHistoric = _.sumBy(robotsArray, (i) => parseInt(i.historic?.foos || 0))
    const barsHistoric = _.sumBy(robotsArray, (i) => parseInt(i.historic?.bars || 0))
    const foobarsHistoric = _.sumBy(robotsArray, (i) => parseInt(i.historic?.foobars || 0))
    const foobarsFailedHistoric = _.sumBy(robotsArray, (i) =>
        parseInt(i.historic?.foobarsFails || 0)
    )

    return (
        <div className="factory">
            <div>
                <Divider textAlign="left">
                    <Chip label={<div>Factory</div>} />
                </Divider>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar sx={{ position: 'relative' }}>
                        <Avatar>
                            <FactoryIcon />
                        </Avatar>
                        {waiting > 0 && (
                            <WatchLaterIcon
                                style={{
                                    position: 'absolute',
                                    top: -20,
                                    left: -20,
                                    color: 'orange',
                                }}
                                sx={{ fontSize: 30 }}
                            />
                        )}
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <div>
                                {activity}
                                {activity && waiting > 0 ? (
                                    <span>
                                        &nbsp;for
                                        <span style={{ color: 'orange' }}>
                                            &nbsp;{_.slice(waiting, 0, 4)}s.
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                        }
                        secondary={
                            <React.Fragment>
                                <Info color="text.primary">Details:</Info>
                                &nbsp;{message || 'waiting'}
                                <br />
                                <Info color="text.primary">Historic:</Info>
                                <Info>Foos collected: {foosHistoric}</Info>
                                <Info>Bars collected: {barsHistoric}</Info>
                                <Info>FooBars assembled: {foobarsHistoric}</Info>
                                <Info color="error">FooBars failed: {foobarsFailedHistoric}</Info>
                                <Info>Credits gains: {historic.credits}</Info>
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <MarketChart data={data} />
            </div>
        </div>
    )
}

const chartSeries = [
    {
        type: 'line',
        name: 'Credits',
        data: [],
    },
]

let chartData = []
const now = new Date().getTime()

const MarketChart = ({ data: defaultData }) => {
    const [data, updateData] = React.useState([])

    React.useEffect(() => {
        const id = setInterval(() => {
            chartData = [...chartData, [Date.now(), parseFloat(defaultData?.stock?.credits || '0')]]
            chartData.length > 50 && chartData.shift()

            console.log(data)
            updateData(chartData)
        }, 1000)
        return () => clearInterval(id)
    }, [defaultData])

    // React.useEffect(() => {
    //     chartSeries[0].data.push({
    //         y: data?.stock?.credits ?? 0,
    //         x: new Date().getTime(),
    //     })
    //     console.log(data?.stock?.credits)
    //     setSeries(_.map(chartSeries))
    // }, [data])

    return <ChartViewer data={data} title="-" />
}

const Info = (props) => (
    <Typography
        {...props}
        sx={{ display: 'inline', marginRight: 1 }}
        component="span"
        variant="body2"
    >
        {props.children} {'  '}
    </Typography>
)

export default Factory
