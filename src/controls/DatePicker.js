import React, { useState } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FormControl } from '@material-ui/core';
import moment from 'moment';
export default function DatePicker(props) {
    const { name, label, value, onChange, error = null, ...other } = props;

    
    const [isOpen, setIsOpen] = useState(false);

    const convertToDefEventPara = (name, value) => ({
        target: {   
            name,
            value
        }
    });

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <FormControl variant="outlined">
                <KeyboardDatePicker
                    style={{ width: 300 }}
                    {...other}
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    label={label}
                    format="dd-MMM-yyyy"
                    name={name}
                    value={value ? moment(value).add(1, 'days').format('YYYY-MM-DD') : null}
                    onChange={(date) => {
                      
                        onChange(convertToDefEventPara(name, date !== '' ? moment(date).format('YYYY-MM-DD') : date))
                        setIsOpen(false); 
                    }
                    }
                    {...(error && { error: true, helperText: error })}


                    KeyboardButtonProps={{
                        onFocus: e => {
                            setIsOpen(true);
                        }
                    }}
                    PopoverProps={{ 
                        disableRestoreFocus: true,
                        onClose: () => {
                            setIsOpen(false);
                        }
                    }}
                    InputProps={{
                        onFocus: () => {
                            setIsOpen(true);
                        }
                    }}
                    open={isOpen}
                />
            </FormControl>
        </MuiPickersUtilsProvider>
    );
}
