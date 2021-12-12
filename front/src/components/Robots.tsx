import React from 'react'
import * as _ from 'lodash'
import robotFoo from '../assets/robotFoo.png'
import robotBar from '../assets/robotBar.png'
import robotFooBar from '../assets/robotFooBar.png'
import robotChange from '../assets/robotChange.png'
import robotWaiting from '../assets/robotWaiting.png'
import {
    Chip,
    Avatar,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

const SortSelect = ({ value, onChange }) => {
    return (
        <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120, position: 'absolute', top: 0, right: 17, zIndex: 999 }}
        >
            <InputLabel id={'sortBy'}>Sort by</InputLabel>
            <Select labelId={'sortBy'} value={value} onChange={onChange} label="Sort by">
                <MenuItem value="">
                    <em>--</em>
                </MenuItem>
                <MenuItem value={'bestFoos'}>Best Foos miner</MenuItem>
                <MenuItem value={'bestFoos'}>Best Bars miner</MenuItem>
                <MenuItem value={'bestFoos'}>Best FooBars builder</MenuItem>
                <MenuItem value={'bestFoos'}>Best FooBars looser</MenuItem>
            </Select>
        </FormControl>
    )
}

const Robots = ({ data }) => {
    const { robots = [] } = data || {}

    const [sortBy, setSortBy] = React.useState('')
    const handleChangeSort = (e) => {
        setSortBy(e.target.value)
    }
    let sortedRobots = _.map(robots, (robot, name) => {
        robot.name = name
        return robot
    })

    switch (sortBy) {
        case '':
            sortedRobots = _.sortBy(sortedRobots)
            break
        case '':
            break
    }

    return (
        <div className="robots">
            <div style={{ paddingTop: 15 }}>
                <SortSelect value={sortBy} onChange={handleChangeSort} />
                {_.map(sortedRobots, (robot) => (
                    <Robot key={robot.name} data={robot} robots={robots} />
                ))}
            </div>
        </div>
    )
}

const Robot = ({ data, robots = [] }) => {
    // const robotsCount = _.keys(robots).length
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
        <div style={{ width: '100%' }}>
            <Divider textAlign="left">
                <Chip label={<div>Robot {data.name}</div>} />
            </Divider>
            <ListItem alignItems="flex-start">
                <ListItemAvatar sx={{ position: 'relative' }}>
                    <Avatar src={image.src} sx={{ height: 70 }} />
                    {waiting ? (
                        <WatchLaterIcon
                            style={{
                                position: 'absolute',
                                top: -20,
                                left: -20,
                                color: 'orange',
                            }}
                            sx={{ fontSize: 30 }}
                        />
                    ) : null}
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <div>
                            {title}
                            {waiting > 0 ? (
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
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Details:
                            </Typography>
                            &nbsp;{message || 'waiting'}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </div>
    )
}

export default Robots
export { Robot }
