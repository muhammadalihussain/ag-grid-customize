import React, {
  Component,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle
} from 'react';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';



import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';



const CustomEditorComponent = forwardRef((props, ref) => {
  const [editing, setEditing] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment(props.value, 'DD-MMM-YYYY').toDate());;

  useEffect(() => {
    if (!editing) {
      props.api.stopEditing();
    }
  }, [editing]);
  function handleDateChange(d) {
    setSelectedDate(moment(d).format('DD-MMM-YYYY'));
  
      setEditing(true);
      setIsOpen(false)
  }

  useImperativeHandle(ref, () => {
      return {
        getValue() {
          return moment(selectedDate).format('DD-MMM-YYYY');
        },
          isCancelAfterEnd: () => {
              return !selectedDate;
          },
          afterGuiAttached: () => {
              if (!props.value) {
                  return;
              }
              const [_, day, month, year] = props.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
              let selectedDate = new Date(year, month - 1, day);
              setSelectedDate(selectedDate);
          }
      };
  });

  return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
           <KeyboardDatePicker
                   
                    style={{ width: '100%', margin: 0, padding: '0px 00px', }}
                 
                    disableToolbar
                    variant="inline"
                    inputVariant="outlined"
                    placeholder={'Enter ' + props.column.colId}
                    format="dd-MMM-yyyy"
                
                    value={selectedDate ? moment(selectedDate).format('DD-MMM-YYYY') : null}
                    onChange={handleDateChange}
                  


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
      </MuiPickersUtilsProvider>
  )
});


export default CustomEditorComponent;
