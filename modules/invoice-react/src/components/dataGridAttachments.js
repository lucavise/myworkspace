import React from "react";
import * as Constants from "../utils/constants";
import axios from "axios";
import Embed from 'react-embed';
import {
	DataGrid,
	Column,
	Selection,
	Button
} from 'devextreme-react/data-grid';

export default function DataGridAttachments(props) {
  const [
    handleRowDblClick
  ] = useDataGridAttachments(props);

  return (
    <>
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
        <Selection mode="multiple" selectAllMode={true} deferred={true} />
        <Column type="buttons" width={40}>
          <Button name="open" hint="Apri in una nuova finestra" icon="far fa-file-pdf" onClick={() => { console.log("ciao") }} />
        </Column>
        <Column type="buttons" width={40}>
          <Button name="openhere" hint="Apri" icon="far fa-eye" onClick={() => { console.log("ciao") }} />
        </Column>
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
    </>
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
      const attachment = await axios.get(uri, {
        responseType: 'blob', // <- I was missing this option
      });
      console.log("result get attachment file");
      console.log(attachment);
      const blob = new Blob([attachment.data], { type: 'application/pdf' });

      /* OPEN IN NEW WINDOW
      // IE
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(attachment.data, "filename");
        return;
      }
      // Chrome, FF
      const fileUrl = URL.createObjectURL(blob);
      const w = window.open(fileUrl, '_blank');
      w && w.focus();
      */

      var reader = new FileReader();
      reader.onload = function (event) {
        var filesrc = URL.createObjectURL(blob);
        props.setFile(filesrc);
      };
      reader.readAsArrayBuffer(attachment.data);

      props.setIsLoadingFile(false);
    } catch (err) {
      console.log(err);
    }
  };

  return [
    handleRowDblClick
  ];
}