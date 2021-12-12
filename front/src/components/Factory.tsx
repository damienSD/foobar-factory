import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import robotFoo from '../assets/robotFoo.png'
import robotBar from '../assets/robotBar.png'
import robotFooBar from '../assets/robotFooBar.png'
import robotChange from '../assets/robotChange.png'
import robotWaiting from '../assets/robotWaiting.png'
import {
    Chip,
    Stack,
    Button,
    Avatar,
    AppBar,
    Toolbar,
    Box,
    FormGroup,
    FormControlLabel,
    Switch,
    Typography,
    ThemeProvider,
    CssBaseline,
    Badge,
    Tooltip,
    Divider,
} from '@mui/material'
import EuroIcon from '@mui/icons-material/Euro'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CodeIcon from '@mui/icons-material/Code'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import FactoryIcon from '@mui/icons-material/Factory'

type FactoryAction = 'stop' | 'start'

const Info = (props) => (
    <Typography
        {...props}
        sx={{ display: 'inline', marginRight: 2 }}
        component="span"
        variant="body2"
    >
        {props.children} {'  '}
    </Typography>
)

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
                                <Info>
                                    Bars collected:
                                    {barsHistoric}
                                </Info>
                                <Info>FooBars assembled: {foobarsHistoric}</Info>
                                <Info color="error">FooBars failed: {foobarsFailedHistoric}</Info>
                                <Info>
                                    Credits gains:
                                    {historic.credits}
                                </Info>
                            </React.Fragment>
                        }
                    />
                    {/* <ListItemText
                        primary={'Historic'}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Details:
                                </Typography>
                                &nbsp;{message}
                            </React.Fragment>
                        }
                    /> */}
                </ListItem>
            </div>
        </div>
    )
}

export default Factory
