import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import robotFoo from './assets/robotFoo.png'
import robotBar from './assets/robotBar.png'
import robotFooBar from './assets/robotFooBar.png'
import robotChange from './assets/robotChange.png'
import {
    Chip,
    Stack,
    Button,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    AppBar,
    Toolbar,
    Box,
    FormGroup,
    FormControlLabel,
    Switch,
    IconButton,
    Typography,
    ThemeProvider,
    CssBaseline,
    Badge,
    Tooltip,
} from '@mui/material'
import EuroIcon from '@mui/icons-material/Euro'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CodeIcon from '@mui/icons-material/Code'
import WatchLaterIcon from '@mui/icons-material/WatchLater'

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
            <Counter value={_.keys(robots).length} color="yellow" icon={<EuroIcon />}>
                Robots
            </Counter>
        </Stack>
    )
}

const Robot = ({ data, index }) => {
    const { activity, waiting } = data

    let image = robotWaiting
    let title = 'Waiting'
    switch (activity) {
        case 'foo':
            image = robotFOO
            break
        case 'bar':
            image = robotBAR
            break
        case 'foobar':
            image = robotFOOBAR
            break
        case 'change':
            image = robotCHANGE
            break
    }

    return (
        <Tooltip open={open} title={<div>Robot {index}</div>} arrow placement="top">
            <div style={{ marginTop: 55 }}>
                <Tooltip open={open} title={title} arrow style={{ fontSize: 15 }}>
                    <div>
                        <Tooltip
                            open={waiting}
                            title={
                                <div>
                                    <WatchLaterIcon /> {waiting}s.
                                </div>
                            }
                            arrow
                            placement="bottom-end"
                        >
                            <img src={image.src} height={100} />
                        </Tooltip>
                    </div>
                </Tooltip>
            </div>
        </Tooltip>
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

    const { factory = {}, robots = {}, stock = {}, built = {} } = data
    console.log(data)

    const started = factory.started ?? false
    const shapeStyles = { bgcolor: 'primary.main', width: 40, height: 40 }
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
                    <Stack direction="row" spacing={5} padding={5}>
                        {_.map(
                            robots,
                            (data, index) =>
                                index != 0 && <Robot key={index} data={data} index={index} />
                        )}
                    </Stack>
                </main>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default Home
