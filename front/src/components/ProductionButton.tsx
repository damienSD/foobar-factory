import React from 'react'
import * as _ from 'lodash'
import { FormGroup, FormControlLabel, Switch, Tooltip } from '@mui/material'

type FactoryAction = 'stop' | 'start' | 'reset'

export default ({ data }) => {
    const started = data.factory?.started ?? false
    const handleChangeFactoryState = (action: FactoryAction) => () => {
        fetch(`/api/${action}/`)
    }
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch
                        checked={started}
                        onChange={handleChangeFactoryState(started ? 'stop' : 'start')}
                    />
                }
                label={
                    started ? (
                        'Production started'
                    ) : (
                        <Tooltip open={true} title="Start the production !" arrow>
                            <div>Production stopped</div>
                        </Tooltip>
                    )
                }
            />
        </FormGroup>
    )
}
