import React from "react";

import {
	DataGrid,
	Column,
	Selection,
	Button
} from 'devextreme-react/data-grid';

export default function DataGridSDIreceipts(props) {
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
				<Button name="open" hint="Apri in una nuova finestra" icon="far fa-file-pdf" onClick={() => {console.log("ciao")}} />
			</Column>
			<Column type="buttons" width={40}>
				<Button name="openhere" hint="Apri" icon="far fa-eye" onClick={() => {console.log("ciao")}} />
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

}