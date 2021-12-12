import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    ThemeProvider,
    CssBaseline,
    LinearProgress,
} from '@mui/material'
import Factory from '../components/Factory'
import Robots from '../components/Robots'
import Counters from '../components/Counters'
import { ProductionButton, ResetButton } from '../components/StatesButtons'

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const Home: NextPage = () => {
    const [data, setData] = React.useState({})

    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                setData(await (await fetch('/api/state/')).json())
            } catch (e) {
                setData({})
            }
        }, 500)
        return () => clearInterval(interval)
    }, [])

    // console.log(data)
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
                        <AppBar position="static" sx={{ background: '#121212' }}>
                            <Toolbar>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1 }}
                                ></Typography>
                                <Counters data={data} />
                            </Toolbar>
                        </AppBar>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Foobar factory{' '}
                                    <CircularProgressWithLabel
                                        value={Math.round(
                                            (_.keys(data?.robots).length * 100) / 30,
                                            2
                                        )}
                                    />
                                </Typography>
                                <ProductionButton data={data} />
                                <ResetButton data={data} />
                            </Toolbar>
                        </AppBar>
                    </Box>
                    {data.factory?.success ? (
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

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: 300 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    )
}
