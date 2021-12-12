import React from 'react'
import * as _ from 'lodash'
import { FormGroup, FormControlLabel, Switch, Tooltip, Button } from '@mui/material'
import DangerousIcon from '@mui/icons-material/Dangerous'

type FactoryAction = 'stop' | 'start' | 'reset'

const ProductionButton = ({ data }) => {
    const started = data.factory?.started ?? false
    const handleChangeFactoryState = (action: FactoryAction) => () => {
        fetch(`/api/${action}/`)
    }
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch
                        color="success"
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

const ResetButton = ({ data }) => {
    const handleReset = () => {
        fetch(`/api/reset/`)
    }
    return (
        <FormGroup>
            <Button
                startIcon={<DangerousIcon />}
                color="error"
                varaint="contained"
                onClick={handleReset}
            >
                Reset
            </Button>
        </FormGroup>
    )
}

export { ProductionButton, ResetButton }
