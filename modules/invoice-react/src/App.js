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
  SearchPanel,
  Scrolling,
  Selection,
  Editing,
  Lookup,
  HeaderFilter,
  FilterBuilderPopup,
  ColumnHeaderFilter
} from 'devextreme-react/data-grid';
import { invoices } from './data/invoices';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';

const exportFormats = ['pdf'];

function App() {

  function sayHelloWorld() {
    alert('Hello world!')
  }

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

  return (
    <div className="App">
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
      >
        <Selection mode="multiple" deferred={true} />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <SearchPanel visible={true}
            width={240}
            placeholder="Search..." />
        <Export enabled={true} formats={exportFormats} allowExportSelectedData={true} />
        <FilterRow visible={true} />
        <FilterPanel visible={true} />
        <FilterBuilderPopup position={filterBuilderPopupPosition} />

        <HeaderFilter
          allowSearch={true}
          visible={true}
        />

        <Column dataField={'Progressivo'} />

        <Column
          dataField={'Etichette'}
        />
        <Column
          dataField={'Data inserimento'}
          dataType={'date'}
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
        />
        <Column
          dataField={'Partita IVA fornitore'}
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
        />
        <Column
          dataField={'Canale principale'}
        />
        <Column
          dataField={'Fase fattura'}
        />
        <Column
          dataField={'Stato fattura'}
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