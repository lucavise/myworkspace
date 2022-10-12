import {
  DataGrid,
  Column,
  Pager,
  Paging,
  Export,
  FilterRow,
  Selection,
  HeaderFilter,
  Toolbar,
  Button,
  Item,
  RemoteOperations,
  MasterDetail,
} from "devextreme-react/data-grid";
import { contracts_data } from "../data/Contracts_data";
import "devextreme/dist/css/dx.material.blue.light.css";
import ContractDetailTemplate from "./ContractDetailTemplate";

export const Contracts: React.FC = () => {
  const contractsData = contracts_data;
  const pageSizes = [10, 25, 50, 100];
  return (
    <div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Elenco contratti</h2>
        </div>
        <div className="panel-body">
          <DataGrid dataSource={contractsData} keyExpr="contractId">
            <Column type="buttons" width={40}>
              <Button
                name="errordatainvoice"
                hint="Errori nei dati salvati"
                icon="fas fa-exclamation-triangle"
              ></Button>
            </Column>
            <Column type="buttons" caption={"Stato"}>
              <Button name="stateinvoice" icon="fas fa-circle"></Button>
            </Column>
            <Column caption={"N° Contratto"} dataField={"contractNumber"} />
            <Column caption={"Descrizione"} dataField={"name"} />
            <Column caption={"Scadenza"} />
            <Column type="buttons" caption={"Sito"}>
              <Button
                name="errordatainvoice"
                hint="Errori nei dati salvati"
                icon="fas fa-link"
              ></Button>
            </Column>
            <Column type="buttons" caption={"Dettaglio"}>
              <Button
                name="errordatainvoice"
                hint="Errori nei dati salvati"
                icon="fas fa-search-plus"
              ></Button>
            </Column>
            <MasterDetail enabled={true} component={ContractDetailTemplate} />
          </DataGrid>
        </div>
      </div>
    </div>
  );
};
