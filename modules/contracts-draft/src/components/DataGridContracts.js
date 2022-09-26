import DataGrid from "devextreme-react/data-grid";
import React from "react";

const columns = ['Stato', 'N° Contratto', 'Descrizione', 'Scadenza', 'Sito', 'Dettaglio'];

export default function DataGridContracts() {
	return (
		<div>
			<DataGrid
				dataSource={contracts}
				keyExpr="ID"
				defaultColumns={columns}
				showBorders={true}>

			</DataGrid>
		</div>
	);
}