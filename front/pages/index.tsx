import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Chip, Stack, Button } from '@mui/material'

const Home: NextPage = () => {
    const [data, setData] = React.useState({})

    const handleStartProduction = () => {
        fetch('/api/start/')
    }

    React.useEffect(() => {
        const interval = setInterval(async () => {
            setData(await (await fetch('/api/state/')).json())
        }, 500)
        return () => clearInterval(interval)
    }, [])

    console.log(data)

    return (
        <div>
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
                <h1>Foobar factory</h1>
                <Button variant="contained" onClick={handleStartProduction}>
                    {' '}
                    Start Production{' '}
                </Button>
            </main>
        </div>
    )
}

export default Home
