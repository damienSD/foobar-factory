import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import * as _ from 'lodash'
import { createTheme } from '@mui/material/styles'
import { AppBar, Toolbar, Box, Typography, ThemeProvider, CssBaseline } from '@mui/material'
import Factory from '../components/Factory'
import Robots from '../components/Robots'
import Counters from '../components/Counters'
import ProductionButton from '../components/ProductionButton'

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
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    Foobar factory
                                </Typography>
                                <Counters data={data} />
                                <ProductionButton data={data} />
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
