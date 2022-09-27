import DataGrid, { Button, Column } from "devextreme-react/data-grid";
import React from "react";
import { contractsData } from "../data/contracts";

const contracts = contractsData;

export default function DataGridUsers() {
	return (
		<div>
			<DataGrid
				dataSource={contracts}
				keyExpr="contractsId"
				showBorders={true}>
				<Column
					caption={'Stato'}
					dataField={'status'}
				/>
				<Column
					caption={'N° Contratto'}
					dataField={'contractnumber'}
				/>
				<Column
					caption={'Descrizione'}
					dataField={'name'}
				/>
				<Column
					caption={'Scadenza'}
					dataField={'status'}
				/>
				<Column
					type="buttons"
					width={40}
					caption={'Sito'}>
					<Button name="open" hint="Sito" icon="fas fa-link" />
				</Column>
				<Column
					type="buttons"
					width={40}
					caption={'Dettaglio'}>
					<Button name="view-signature-doc" hint="Dettaglio" icon="fas fa-search-plus" />
				</Column>
			</DataGrid>
		</div>
	);
}