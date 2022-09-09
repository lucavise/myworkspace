import React from "react";
import * as Constants from "../utils/constants";
import axios from "axios";
import FileViewer from "react-file-viewer";
import { CustomErrorComponent } from 'custom-error';

import {
  DataGrid,
  Column
} from 'devextreme-react/data-grid';

export default function DataGridAttachments(props) {
  const [
    handleRowDblClick,
    file,
    isLoadingFile
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

      <embed
        type="application/pdf"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%" id="prova" src=""/>
    </>
  );
}

function useDataGridAttachments(props) {
  const [file, setFile] = React.useState();
  const [isLoadingFile, setIsLoadingFile] = React.useState(true);


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
      setFile(attachment.data);
      /*
      const url = URL.createObjectURL(new Blob([attachment.data]));
      const link = document.createElement('a');
      link.href = url;
      link.click();
      */

      /*
      var byteArray = new Uint8Array(attachment.data);
      var a = window.document.createElement('a');
      var filesrc = window.URL.createObjectURL(new Blob(byteArray, { type: 'application/octet-stream' }));
      document.getElementById("prova").setAttribute("src", filesrc);
      */

      var reader = new FileReader();
      reader.onload = function (event) {
        var filesrc = URL.createObjectURL(attachment.data);
        document.getElementById("prova").setAttribute("src", filesrc);
      };
      reader.readAsArrayBuffer(attachment.data);

      /*
      const reader = new FileReader();
      reader.readAsDataURL(attachment.data);
      reader.addEventListener("load", function () {
        document.getElementById("prova").setAttribute("src", filesrc);
      })
      */
      setIsLoadingFile(false);
    } catch (err) {
      console.log(err);
    }
  };

  return [
    handleRowDblClick,
    file,
    isLoadingFile
  ];
}