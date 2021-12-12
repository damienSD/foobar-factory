import React from 'react'
import * as _ from 'lodash'
import robotFoo from '../assets/robotFoo.png'
import robotBar from '../assets/robotBar.png'
import robotFooBar from '../assets/robotFooBar.png'
import robotChange from '../assets/robotChange.png'
import robotWaiting from '../assets/robotWaiting.png'
import { Chip, Avatar, Typography, Divider } from '@mui/material'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

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
