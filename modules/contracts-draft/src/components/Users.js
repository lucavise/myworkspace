import React from "react";
import DataGridUsers from "./DataGridUsers";

export default function Users() {
	return (
		<div className="panel panel-default panel-users">
			<div className="panel-heading">
				<h2 className="panel-title">
					Utenti
				</h2>
			</div>
			<DataGridUsers></DataGridUsers>
		</div>
	);
}