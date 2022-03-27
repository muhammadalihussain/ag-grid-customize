import React from 'react';
import {
	FormControl,
	FormLabel,
	RadioGroup as MuiRadioGroup,
	FormControlLabel,
	Radio,
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';

export default function RadioGroup(props) {
    const { name, label, value, onChange, items, error = null, ...other } = props;


	return (
        <FormControl  {...(error && { error: true, helperText: error })}>
         
           
            <FormLabel>{label} </FormLabel>
			<MuiRadioGroup row name={name} value={value} onChange={onChange}>
				{items.filter(i => i.Name !='').map((item) => (
					<FormControlLabel style={{height:'40px'}}
						key={item.Id}
						value={item.Id}
						control={<Radio  checked={item.Id==value} />}
						label={item.Name} 
                       
					/>
					
                ))}
           
            </MuiRadioGroup>
            <FormHelperText>{error}</FormHelperText>
		</FormControl>
	);
}
