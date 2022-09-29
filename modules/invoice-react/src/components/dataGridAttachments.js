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
    fetchAndShowFile,
    fetchAndOpenFile,
    handleVisibleAttachment
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
      // onContentReady={handleContentReadyOfDataGrid}
      >
        <Selection mode="multiple" selectAllMode={true} deferred={true} />
        <Column type="buttons" width={40}>
          <Button name="open" hint="Apri in una nuova finestra" icon="far fa-file-pdf" onClick={fetchAndOpenFile} />
        </Column>
        <Column type="buttons" width={40}>
          <Button name="openhere" visible={handleVisibleAttachment(props.list.name)} hint="Apri" icon="far fa-eye" onClick={fetchAndShowFile} />
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
  console.log(props);
  const handleVisibleAttachment = (name) => {
    if (name !== null && name !== undefined) {
      switch (name) {
        case name.indexOf(".PDF") != -1:
          return true;
        case name.indexOf(".pdf") != -1:
          return true;
        case name.indexOf(".xml") != -1:
          return false;
        case name.indexOf(".p7m") != -1:
          return false;
        case name.indexOf(".P7M") != -1:
          return false;
        case name.indexOf(".log") != -1:
          return false;
        case name.indexOf(".zip") != -1:
          return false;
        default: 
          return false;
      }
    } else {
      return false;
    }
  }

  const fetchAndShowFile = (e) => {
    fetchAttachmentFile(e.row.data);
  }

  const fetchAndOpenFile = async (e) => {
    
    try {
      const uri = themeDisplay.getPortalURL() + Constants.fetchAttachmentFile + e.row.data.attachmentCardId + "/a/" + e.row.data.code + "?p_auth=" + Liferay.authToken
      const mainFile = await axios.get(uri, {
        responseType: 'blob', // <- I was missing this option
      });
      console.log("result post main file");
      console.log(mainFile);
      console.log("TYPE --> " + mainFile.headers.extension);
      
      if (mainFile.data.size !== 0) {
        const mainblob = new Blob([mainFile.data], { type: handleApplicationType(mainFile.headers.extension) });
        var readerMain = new FileReader();
        readerMain.onload = function (event) {
          var mainfilesrc = URL.createObjectURL(mainblob);
          // props.setFile(mainfilesrc);
          const link = document.createElement('a');
          link.setAttribute("target", "_blank");
          link.href = mainfilesrc;
          link.click();
        };
        readerMain.readAsArrayBuffer(mainFile.data);
      }
      // setTypeFile(typeDescfound);
      // setIsLoadingFile(false);
      // setIsAttachmentsLoading(false);
    } catch (err) {
      if (err.message.indexOf("403") !== -1) {

      }
    }
  };

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

  const handleApplicationType = (extension) => {
    switch (extension) {
      case ".P7M":
        return "application/pkcs7-mime";
      case ".xml":
        return "application/xml";
      case ".p7m":
        return "application/pkcs7-mime";
      case ".PDF":
        return "application/pdf";
      case ".log":
        return "text/plain";
      case ".zip":
        return "application/zip";
      default: 
        return "application/pdf";
    }
  }

  return [
    fetchAndShowFile,
    fetchAndOpenFile,
    handleVisibleAttachment
  ];
}