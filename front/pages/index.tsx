import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import robotFoo from './assets/robotFoo.png'
import robotBar from './assets/robotBar.png'
import robotFooBar from './assets/robotFooBar.png'
import robotChange from './assets/robotChange.png'
import robotWaiting from './assets/robotWaiting.png'
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

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const Counter = ({ children, color, value, icon }) => {
    return (
        <Badge
            badgeContent={value}
            color="secondary"
            sx={{ '& .MuiBadge-badge': { backgroundColor: color } }}
            overlap="circular"
        >
            <Chip icon={icon} label={<div style={{ marginRight: 5 }}>{children}</div>} />
        </Badge>
    )
}

const Counters = ({ data }) => {
    const { robots = {}, stock = {} } = data
    return (
        <Stack direction="row" spacing={2} marginRight={5}>
            <Counter
                value={_.keys(robots).length - 1}
                color="gray"
                icon={<PrecisionManufacturingIcon />}
            >
                Robots
            </Counter>
            <Counter value={stock.bars} color="#8d52fb" icon={<ChevronLeftIcon />}>
                Bars
            </Counter>
            <Counter value={stock.foos} color="#21cfaa" icon={<ChevronRightIcon />}>
                Foos
            </Counter>
            <Counter value={stock.foobars} color="#f79f25" icon={<CodeIcon />}>
                FooBars
            </Counter>
            <Counter value={stock.credits} color="#38b6fc" icon={<EuroIcon />}>
                Credits
            </Counter>
        </Stack>
    )
}

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
                                &nbsp;{message || 'n/a'}
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

const Robots = ({ data }) => {
    const { robots = [] } = data || {}
    return (
        <div className="robots">
            <div>
                {_.map(
                    robots,
                    (data, index) =>
                        index != 0 && (
                            <Robot key={index} data={data} index={index} robots={robots} />
                        )
                )}
            </div>
        </div>
    )
}

const Robot = ({ data, index, robots = [] }) => {
    const robotsCount = _.keys(robots).length
    const { activity, waiting, message } = data || {}

    let image = robotWaiting
    let title = activity
    switch (activity) {
        case 'foo':
            image = robotFoo
            title = 'Mining Foo'
            break
        case 'bar':
            image = robotBar
            title = 'Mining Bar'
            break
        case 'foobar':
            image = robotFooBar
            title = 'Assemblying FooBar'
            break
        case 'change':
            image = robotChange
            title = 'Changing activity'
            break
        case 'waiting':
            image = robotWaiting
            title = 'Waiting'
            break
    }

    return (
        <div>
            <Divider textAlign="left">
                <Chip label={<div>Robot {index}</div>} />
            </Divider>
            <ListItem alignItems="flex-start">
                <ListItemAvatar sx={{ position: 'relative' }}>
                    <Avatar src={image.src} sx={{ height: 70 }} />
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
                            {title}
                            {waiting ? (
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
                            &nbsp;{message}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </div>
    )
}

const Home: NextPage = () => {
    const [data, setData] = React.useState({})

    const handleChangeFactoryState = (action: FactoryAction) => () => {
        fetch(`/api/${action}/`)
    }

    React.useEffect(() => {
        const interval = setInterval(async () => {
            setData(await (await fetch('/api/state/')).json())
        }, 500)
        return () => clearInterval(interval)
    }, [])

    const { factory = {} } = data
    // console.log(data)

    const started = factory.started ?? false
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Head>
                    <title>Foobar factory</title>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    />
                </Head>

                <main>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Foobar factory
                                </Typography>
                                <Counters data={data} />
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={started}
                                                onChange={handleChangeFactoryState(
                                                    started ? 'stop' : 'start'
                                                )}
                                            />
                                        }
                                        label={
                                            started ? (
                                                'Production started'
                                            ) : (
                                                <Tooltip
                                                    open={true}
                                                    title="Start the production !"
                                                    arrow
                                                >
                                                    <div>Production stopped</div>
                                                </Tooltip>
                                            )
                                        }
                                    />
                                </FormGroup>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    {factory.success ? (
                        <div style={{ fontSize: 40, color: 'green', padding: '20%' }}>
                            30 Robots ! Success !
                        </div>
                    ) : (
                        <>
                            <Factory data={data} />
                            <Robots data={data} />
                        </>
                    )}
                </main>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default Home
