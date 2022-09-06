import React from "react";
import * as Constants from "../utils/constants";
import axios from "axios";

import {
  DataGrid,
  Column
} from 'devextreme-react/data-grid';

export default function DataGridAttachments(props) {
  const [
    handleRowDblClick
  ] = useDataGridAttachments(props);

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
      onRowDblClick={handleRowDblClick}
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

  const handleRowDblClick = (e) => {
    console.log(e);
    fetchAttachmentFile(e.data);
  }

  const fetchAttachmentFile = async (ev) => {
    try {
      const uri = themeDisplay.getPortalURL() + Constants.fetchAttachmentFile + ev.attachmentCardId + "/a/" + ev.code + "?p_auth=" + Liferay.authToken
      const attachment = await axios.get(uri);
      console.log("result get attachment file");
    } catch (err) {
      console.log(err);
    }
  };

  return [
    handleRowDblClick
  ];
}