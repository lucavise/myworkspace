import React from "react";
import DataGridCompanies from "./DataGridCompanies";

export default function Companies() {
	return(
		<div className="panel panel-default panel-companies">
			<div className="panel-heading">
				<h2 className="panel-title">
					Aziende
				</h2>
			</div>
			<DataGridCompanies></DataGridCompanies>
		</div>
	);
}