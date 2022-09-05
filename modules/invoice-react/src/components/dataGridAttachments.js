import React from "react";

import {
  DataGrid,
  Column
} from 'devextreme-react/data-grid';

export default function DataGridAttachments(props) {
  return (

    <DataGrid
      id="dataGridAttachments"
      dataSource={props.list}
      keyExpr="attachmentCardId"
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
        caption={'Nome'}
        dataField={'name'}
      />
      <Column
        caption={'Note'}
        dataField={'note'}
      />
      <Column
        caption={'Size'}
        dataField={'size'}
      />
    </DataGrid>

  );
}

function useDataGridAttachments(props) {

}