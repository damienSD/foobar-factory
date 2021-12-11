import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import robotFOO from './assets/robotFOO.png'
import robotBAR from './assets/robotBAR.png'
import robotWaiting from './assets/robotWaiting.png'
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

type FactoryAction = 'stop' | 'start'

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const Counter = ({ children, color, value, icon }) => {
    return (
        <Badge badgeContent={value} color="secondary" style={{ color }} overlap="circular">
            <Chip icon={icon} label={<div style={{ marginRight: 5 }}>{children}</div>} />
        </Badge>
    )
}

const Robot = ({ data, index }) => {
    const activityImage = data.activity ? robotFOO : robotBAR
    const stateImage = data.waiting ? robotWaiting : activityImage
    return (
        <div style={{}}>
            <Tooltip open={open} title="Add" arrow>
                <img src={stateImage.src} height={100} />
            </Tooltip>
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

                                <Stack direction="row" spacing={2} marginRight={5}>
                                    <Counter value={stock.bars} color="purple" icon={<EuroIcon />}>
                                        Bars
                                    </Counter>
                                    <Counter value={stock.foos} color="purple" icon={<EuroIcon />}>
                                        Foos
                                    </Counter>
                                    <Counter
                                        value={stock.foobars}
                                        color="purple"
                                        icon={<EuroIcon />}
                                    >
                                        FooBars
                                    </Counter>
                                    <Counter
                                        value={stock.credits}
                                        color="purple"
                                        icon={<EuroIcon />}
                                    >
                                        Credits
                                    </Counter>
                                </Stack>
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
                        {_.map(robots, (data, index) => (
                            <Robot key={index} data={data} index={index} />
                        ))}
                    </Stack>
                </main>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default Home
