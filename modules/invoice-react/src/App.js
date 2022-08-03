import React from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import {
  DataGrid,
  Column,
  Pager,
  Paging,
  Export,
  FilterRow,
  FilterPanel,
  Selection,
  Button,
  HeaderFilter,
  FilterBuilderPopup,
  LoadPanel,
  Toolbar,
  Item
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import SelectBox from 'devextreme-react/select-box';
import { invoices } from './data/invoices';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';

const exportFormats = ['pdf'];

function App() {
  const [invoiceState, setInvoiceState] = React.useState();
  const [invoiceType, setInvoiceType] = React.useState();
  const [invoicePeriod, setInvoicePeriod] = React.useState();

  const onExporting = React.useCallback((e) => {
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      indent: 5,
    }).then(() => {
      doc.save('Companies.pdf');
    });
  });

  const optionsInvoiceState = [{
    "ID": 1,
    "name": "DA LAVORARE"
  },
  {
    "ID": 2,
    "name": "DA FIRMARE"
  }];

  const optionsInvoiceType = [{
    "ID": 1,
    "name": "B2B"
  },
  {
    "ID": 2,
    "name": "PA"
  }];

  const optionsInvoicePeriod = [{
    "ID": 1,
    "name": "Libero"
  },
  {
    "ID": 2,
    "name": "Mese precedente"
  }];

  const handleChangeInvoiceState = (e) => {
    console.log("--> ciao " + JSON.stringify(e.value));
    setInvoiceState(JSON.stringify(e.value));
  }

  const handleChangeInvoiceType = (e) => {
    console.log("--> ciao 2 " + e);
    setInvoiceType(JSON.stringify(e.value));
  }

  const handleChangeInvoicePeriod = (e) => {
    // console.log("--> ciao 3 " + e);
    setInvoicePeriod(JSON.stringify(e.value));
  }

  return (
    <div className="App invoice-react">
      <div className='stato'>{invoiceState !== undefined && invoiceState}</div>
      <div className='tipo'>{invoiceType !== undefined && invoiceType}</div>
      <div className='panel-container'>
        <DataGrid
          id="dataGrid"
          dataSource={invoices}
          keyExpr="Progressivo"
          className={'dx-card wide-card'}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={onExporting}
          showColumnLines={false}
          showRowLines={true}
          rowAlternationEnabled={true}
        >
          <Selection mode="multiple" selectAllMode={true} deferred={true} />
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <LoadPanel enabled={true} />
          <Export enabled={true} formats={exportFormats} allowExportSelectedData={true} />
          <FilterRow visible={true} />
          <FilterPanel visible={true} />
          <FilterBuilderPopup position={filterBuilderPopupPosition} />
          <Toolbar>
            <Item location="before">
              <SelectBox
                width="225"
                dataSource={optionsInvoiceState}
                displayExpr="name"
                keyExpr="ID"
                onValueChanged={handleChangeInvoiceState}
              />
            </Item>
            <Item location="before">
              <SelectBox
                width="225"
                dataSource={optionsInvoiceType}
                displayExpr="name"
                keyExpr="ID"
                onChange={handleChangeInvoiceType}
              />
            </Item>
            <Item location="before">
              <SelectBox
                width="225"
                dataSource={optionsInvoicePeriod}
                displayExpr="name"
                keyExpr="ID"
                onChange={handleChangeInvoicePeriod}
              />
            </Item>
          </Toolbar>
          <HeaderFilter
            allowSearch={true}
            visible={true}
          />
          <Column type="buttons" width={150}>
            <Button name="open" hint="Dettaglio" icon="fas fa-search-plus" />
            <Button name="view-signature-doc" hint="Visualizza documento principale in una nuova scheda [Firmato]" icon="fas fa-file-signature" />
            <Button name="" hint="Ricevute e comunicazioni SDI" icon="fas fa-stream" />
          </Column>

          <Column dataField={'Progressivo'} allowFiltering={false} />

          <Column
            dataField={'Etichette'} allowFiltering={false}
          />
          <Column
            dataField={'Data inserimento'}
            dataType={'date'}
            filterOperations={['=', '<=', '>=', 'between']}
          />
          <Column
            dataField={'In carico a'}
          >
          </Column>
          <Column
            dataField={'Data trasmissione'}
            dataType={'date'}
          />
          <Column
            dataField={'Numero fattura'}
          />
          <Column
            dataField={'Data fattura'}
            dataType={'date'}
            allowFiltering={false}
          />
          <Column
            dataField={'Partita IVA fornitore'}
            allowFiltering={false}
          />
          <Column
            dataField={'CF fornitore'}
          />
          <Column
            dataField={'Rag. Soc. Fornitore'}
          />
          <Column
            dataField={'P.IVA cliente'}
          />
          <Column
            dataField={'CF cliente'}
          />
          <Column
            dataField={'Rag. Soc. cliente'}
          />
          <Column
            dataField={'Codice cliente'}
          />
          <Column
            dataField={'Data prima scadenza'}
            dataType={'date'}
          />
          <Column
            dataField={'Totale fattura'}
          />
          <Column
            dataField={'Codice valuta'}
          />
          <Column
            dataField={'Tipo documento'}
          />
          <Column
            dataField={'Formato trasmissione'}
            allowFiltering={false}
          />
          <Column
            dataField={'Canale principale'}
          />
          <Column
            dataField={'Fase fattura'}
          />
          <Column
            dataField={'Stato fattura'}
            allowFiltering={false}
          />
          <Column
            dataField={'Stato conservazione'}
          />
          <Column
            dataField={'Progressivo invio'}
          />
          <Column
            dataField={'Identificativo SDI'}
          />
        </DataGrid>
      </div>
    </div>
  );
}

function getOrderDay(rowData) {
  return (new Date(rowData.OrderDate)).getDay();
}

const filterBuilderPopupPosition = {
  of: window,
  at: 'top',
  my: 'top',
  offset: { y: 10 },
};

const filterBuilder = {
  customOperations: [{
    name: 'weekends',
    caption: 'Weekends',
    dataTypes: ['date'],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression: () => [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]],
  }],
  allowHierarchicalFields: true,
};

// const filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['OrderDate', 'weekends']];
const filterValue = [];

/*
const saleAmountHeaderFilters = [{
  text: 'Less than $3000',
  value: ['SaleAmount', '<', 3000],
}, {
  text: '$3000 - $5000',
  value: [['SaleAmount', '>=', 3000], ['SaleAmount', '<', 5000]],
}, {
  text: '$5000 - $10000',
  value: [['SaleAmount', '>=', 5000], ['SaleAmount', '<', 10000]],
}, {
  text: '$10000 - $20000',
  value: [['SaleAmount', '>=', 10000], ['SaleAmount', '<', 20000]],
}, {
  text: 'Greater than $20000',
  value: ['SaleAmount', '>=', 20000],
}];
*/

export default App;