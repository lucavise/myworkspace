import React from "react";
import DataGridContracts from "./DataGridContracts";

export default function Contracts() {
	return (
		<div className="panel panel-default panel-contracts">
			<div className="panel-heading">
				<h2 className="panel-title">
					Contratti
				</h2>
			</div>
			<DataGridContracts>
				
			</DataGridContracts>
		</div>
	);
}