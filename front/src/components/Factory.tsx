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

const Factory = ({ data = {} }) => {
    const { factory = {}, historic = {} } = data
    const { activity, waiting, message } = factory
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
                                {activity && waiting ? (
                                    <span>
                                        &nbsp;for
                                        <span style={{ color: 'orange' }}>
                                            &nbsp;{Math.round(waiting, 2)}s.
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                        }
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
                                &nbsp;{message || 'waiting'}
                                <br />
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Historic:
                                </Typography>
                                &nbsp; Foos collected: {historic.foos}, Bars collected:
                                {historic.bars}, FooBars assembled: {historic.foobars}, Credits
                                gains: {historic.credits}
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
