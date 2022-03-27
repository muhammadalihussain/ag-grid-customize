import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import ConfirmDialog from './ConfirmDialog.js';
import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Controls from "./controls/Controls";

function App() {
  const [columns, setColumns] = useState([]);
  const [result, setResults] = useState([]);



  function actionCellRenderer(params) {
   
  
    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex;
    });
  
    if (isCurrentRowEditing) {
      return (<div><a  className="action-button update"  data-action="update"> Update </a> 
           <a  className="action-button cancel"  data-action="cancel" > Cancel </a> </div>);
    } else {
      return (<div><a className="action-button edit"  data-action="edit" > Edit  </a>
                            <a className="action-button delete" data-action="delete" > Delete </a></div>);
    }
  
    
  }


  const filterParams = {
    comparator: function(filterLocalDateAtMidnight, cellValue) {
      var dateAsString = cellValue;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    }
  };

  const [Dropdown, setDropdown] = useState([
    { Id: 1, text: 'dropdown1' },
    { Id: 2, text: 'dropdown2' },
    { Id: 3, text: 'dropdown3' },
  
  ]);

  const columnDefs = [
   
    { headerName: "ID", field: "id" },
    { headerName: "Checkbox", field: "checkbox",editable: false, cellRenderer: "checkboxRenderer"},

    { headerName: "Date", field: "date", sort: "desc",
    cellEditor:'customEditor',
    editable: true,
    filter: 'agDateColumnFilter',
    filterParams: filterParams,
  },

    { headerName: "Dropdown", field: "dropdown"
  
  ,      editable: true,
    filter: false,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: Dropdown.filter((i) => i.text !== '').map((s) => s.text)
    },

    valueSetter: function (params) {
     
      params.data.dropdown = Dropdown.find((refData) => refData.text === params.newValue).Id;
      return true;
    },

    valueGetter: function (params) {
     
      return Dropdown.find((refData) => refData.Id === params.data.dropdown).text;
    }
  },

    { headerName: "Textbox", field: "textbox" ,editable: true,

    valueGetter: (params) => {
      return params.data.textbox;
    },
    valueSetter: (params) => {
      params.data.textbox = params.newValue;
      return true;
    }
  
  },



    {
      headerName: 'Action',
      minWidth: 150,
      // pinned: 'right',
      filter: false,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action'
    },
  ];

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });
  



  // const rowData = [
  //   {
  //     id: 1,
  //     checkbox: true,
  //     date: "01-Jan-2022",
  //     dropdown: 1,
  //     textbox: "text1"
  //   },
  //   {
  //     id: 2,
  //     checkbox: false,
  //     date: "02-Jan-2022",
  //     dropdown: 2,
  //     textbox: "text2"
  //   },
  //   {
  //     id: 3,
  //     checkbox: true,
  //     date: "03-Jan-2022",
  //     dropdown: 3,
  //     textbox: "text3"
  //   }
  // ];
  

  
  const defaultColDef = {
    editable: false,
    flex: 1,
    filter: true,
    sortable: true
  };

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setResults([
      {
        id: 1,
        checkbox: true,
        date: "01-Jan-2022",
        dropdown: 1,
        textbox: "text1"
      },
      {
        id: 2,
        checkbox: false,
        date: "02-Jan-2022",
        dropdown: 2,
        textbox: "text2"
      },
      {
        id: 3,
        checkbox: true,
        date: "03-Jan-2022",
        dropdown: 3,
        textbox: "text3"
      }
    ])
  }



  const onCellClicked = (params) => {
    // Handle click event for action cells
    if (params.column.colId === 'action' && params.event.target.dataset.action) {
      params.api.undoCellEditing();
      let action = params.event.target.dataset.action;

      if (action === 'edit') {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === 'delete') {

				setConfirmDialog({
					isOpen: true,
					title: 'Are you sure to delete Id: ' + params.data.id + ' this record?',
					subTitle: "You can't undo this operation",
					onConfirm: () => {

            setConfirmDialog({
              ...confirmDialog,
              isOpen: false,
            });
						console.log(params.data.id);
					
            // params.api.applyTransaction({
						// 	remove: [params.node.data],
						// });

					},
				});


			}

      if (action === 'update') {
     
        
        params.api.stopEditing(false);
        console.log(params.data)
      

        setResults([
          {
            id: 1,
            checkbox: true,
            date: "01-Jan-2022",
            dropdown: 1,
            textbox: "text1"
          },
          {
            id: 2,
            checkbox: false,
            date: "02-Jan-2022",
            dropdown: 2,
            textbox: "text2"
          },
          {
            id: 3,
            checkbox: true,
            date: "03-Jan-2022",
            dropdown: 3,
            textbox: "text3"
          }
        ])

      //  gridApi.setRowData(rowData)


       
      }

      if (action === 'cancel') {
        params.api.stopEditing(true);
      }
    }
  };
  const onRowEditingStarted = (params) => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true
    });
  };
  const onRowEditingStopped = (params) => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true
    });
  };

 


	const frameworkComponents = {

    agDateInput: Controls.CustomDateComponent,
    customEditor: Controls.CustomEditorComponent  
	
	};


  

  return (
    <div className="dashboard__card">
      <div id="grid-wrapper" style={{ width: '100%', height: '100%' }}>
              {/* <button onClick={() => onExportClick()}>Export</button> */}
              <div className="ag-theme-alpine" style={{ width: '100%', height: '560px' }}>
                <AgGridReact
                  frameworkComponents={frameworkComponents}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  rowData={result}
                  columnDefs={columnDefs}
                  onRowEditingStopped={onRowEditingStopped}
                  onRowEditingStarted={onRowEditingStarted}
                  onCellClicked={onCellClicked}
                  suppressClickEdit={true}
                  undoRedoCellEditing={true}
                  editType="fullRow"
                  rowSelection="multiple"
                  components={{
                    checkboxRenderer: Controls.CheckboxRenderer,
                   
                  }}

                    pagination={true}
										paginationPageSize={10}
                  
                ></AgGridReact>
                </div>
                </div>
                <ConfirmDialog
							confirmDialog={confirmDialog}
							setConfirmDialog={setConfirmDialog}
						/>
    </div>
  );
}

export default App;
