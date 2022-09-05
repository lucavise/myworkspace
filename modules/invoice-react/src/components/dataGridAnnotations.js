import React from "react";

import {
  DataGrid,
  Column
} from 'devextreme-react/data-grid';

export default function DataGridAnnotations(props) {
  return (

    <DataGrid
      id="dataGridAnnotations"
      dataSource={props.list}
      keyExpr="author"
      className={'dx-card wide-card'}
      allowColumnReordering={true}
      allowColumnResizing={true}
      columnAutoWidth={true}
      showColumnLines={false}
      showRowLines={true}
      rowAlternationEnabled={true}
      // onRowDblClick={handleRowDblClick}
      // onContentReady={handleContentReadyOfDataGrid}
    >
      <Column
        caption={'Autore'}
        dataField={'author'}
      />
      <Column
        caption={'Data'}
        dataField={'date'}
        dataType="date"
      />
      <Column
        caption={'Testo'}
        dataField={'text'}
      />
    </DataGrid>

  );
}

function useDataGridAnnotations(props) {

}