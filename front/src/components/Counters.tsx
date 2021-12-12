import React from 'react'
import * as _ from 'lodash'
import { Chip, Stack, Badge, Tooltip } from '@mui/material'
import EuroIcon from '@mui/icons-material/Euro'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CodeIcon from '@mui/icons-material/Code'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'

const Counter = ({ children, color, value: incomingValue, icon }) => {
    const [value, setValue] = React.useState(incomingValue)
    const [diff, setDiff] = React.useState(null)
    let snackTo = null
    React.useEffect(() => {
        if (value != incomingValue) {
            setValue(incomingValue)
            setDiff(incomingValue - value)
            clearTimeout(snackTo)
            snackTo = setTimeout(() => setDiff(null), 2000)
        }
    }, [incomingValue])

    return (
        <Tooltip
            sx={{
                '& .MuiTooltiop-Tooltip': {
                    backgroundColor: 'red',
                },
            }}
            open={Boolean(diff)}
            title={`${diff > 0 ? '+' : ''}${diff ? diff : ''}`}
            arrow
        >
            <Badge
                badgeContent={value}
                color="secondary"
                sx={{ '& .MuiBadge-badge': { backgroundColor: color } }}
                overlap="circular"
            >
                <Chip icon={icon} label={<div style={{ marginRight: 5 }}>{children}</div>} />
            </Badge>
        </Tooltip>
    )
}

const Counters = ({ data }) => {
    const { robots = {}, stock = {}, historic = {} } = data
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
            <Counter value={historic.foobarsFailed} color="#f25348" icon={<CodeIcon />}>
                FooBars failed
            </Counter>
            <Counter value={stock.credits} color="#38b6fc" icon={<EuroIcon />}>
                Credits
            </Counter>
        </Stack>
    )
}

export default Counters
export { Counter }
