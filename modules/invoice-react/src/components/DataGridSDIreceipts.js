import React from "react";

import {
	DataGrid,
	Column,
	Selection,
	Button
} from 'devextreme-react/data-grid';
import axios from "axios";
import * as Constants from "../utils/constants";

export default function DataGridSDIreceipts(props) {
	const [
		fetchMainFile,
		fetchAndOpenFile
	] = useDataGridSDIreceipts(props);

	return (
		<DataGrid
			id="dataGridSDIreceipts"
			dataSource={props.list}
			keyExpr="typeDescr"
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
			<Selection mode="multiple" selectAllMode={true} deferred={true} />
			<Column type="buttons" width={40}>
				<Button name="open" hint="Apri in una nuova finestra" icon="far fa-file-pdf" onClick={fetchAndOpenFile} />
			</Column>
			<Column type="buttons" width={40}>
				<Button name="openhere" hint="Apri" icon="far fa-eye" onClick={fetchMainFile}
				/>
			</Column>
			<Column
				caption={'Tipo'}
				dataField={'typeDescr'}
			/>
			<Column
				caption={'Data'}
				dataField={'receiptDate'}
				dataType="date"
			/>
			<Column
				caption={'Descrizione'}
				dataField={'description'}
			/>
			<Column
				caption={'Note'}
				dataField={'note'}
			/>
		</DataGrid>

	);
}

function useDataGridSDIreceipts(props) {
	console.log(props.list);

	const fetchMainFile = async (e) => {
		console.log(e);

		try {
			const uri = themeDisplay.getPortalURL() + Constants.fetchMainFile + "?p_auth=" + Liferay.authToken
			const inputForMainFile = {
				viewType: 2,
				cardCode: e.row.data.cardId,
				entityType: "text/html",
				resourceName: e.row.data.typeDescr,
				isSigned: false
			}
			const mainFile = await axios.post(uri, inputForMainFile, {
				responseType: 'blob', // <- I was missing this option
			});
			console.log("result post main file");
			console.log(mainFile);
			const type = mainFile.headers.typefile;

			// setTypeFile(typeDescfound);
			const mainblob = new Blob([mainFile.data], { type: "text/html" });
			var readerMain = new FileReader();
			readerMain.onload = function (event) {
				var mainfilesrc = URL.createObjectURL(mainblob);
				props.setFile(mainfilesrc);
			};
			readerMain.readAsArrayBuffer(mainFile.data);
			// setIsLoadingFile(false);
			// setIsAttachmentsLoading(false);
		} catch (err) {
			if (err.message.indexOf("403") !== -1) {

			}
		}
	};

	const fetchAndOpenFile = async (e) => {
		try {
			const uri = themeDisplay.getPortalURL() + Constants.fetchMainFile + "?p_auth=" + Liferay.authToken
			const inputForMainFile = {
				viewType: 2,
				cardCode: e.row.data.cardId,
				entityType: "text/html",
				resourceName: e.row.data.typeDescr,
				isSigned: false
			}
			const mainFile = await axios.post(uri, inputForMainFile, {
				responseType: 'blob', // <- I was missing this option
			});
			console.log("result post main file");
			console.log(mainFile);
			const type = mainFile.headers.typefile;

			// setTypeFile(typeDescfound);
			const mainblob = new Blob([mainFile.data], { type: "text/html" });
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
			// setIsLoadingFile(false);
			// setIsAttachmentsLoading(false);
		} catch (err) {
			if (err.message.indexOf("403") !== -1) {

			}
		}
	};

	return [
		fetchMainFile,
		fetchAndOpenFile
	];

}