import React, { useEffect } from 'react';
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
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import DateBox from 'devextreme-react/date-box';
import DropDownBox from 'devextreme-react/drop-down-box';
import SelectBox from 'devextreme-react/select-box';
import { invoices } from './data/invoices';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { useUserLiferay } from './utils/useUserLiferay';

const exportFormats = ['pdf'];
const optionsInvoiceState = [{
  "ID": 1,
  "name": "DA LAVORARE"
},
{
  "ID": 2,
  "name": "DA FIRMARE"
},
{
  "ID": 3,
  "name": "CONSEGNATO"
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

const optionsPeriodTypePopup = [{
  "ID": 1,
  "name": "Compreso tra"
},
{
  "ID": 2,
  "name": "Uguale a"
}];

function App() {
  const [invoiceState, setInvoiceState] = React.useState();
  const [invoiceType, setInvoiceType] = React.useState();
  const [invoicePeriod, setInvoicePeriod] = React.useState();
  const [typePeriodPopup, setTypePeriodPopup] = React.useState();
  const [multiValuesInvoiceState, setMultiValuesInvoiceState] = React.useState([1]);
  const [treeViewMine, setTreeViewMine] = React.useState();
  const userLogged = useUserLiferay();
  const [popupRowDataVisible, setPopupRowDataVisible] = React.useState(false);
  const [popupRowData, setPopupRowData] = React.useState();
  const [allDataInGrid, setAllDataInGrid] = React.useState([]);
  const [indexPopupRowData, setIndexPopupRowData] = React.useState(0);

  /*
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
  */

  const dataGridRef = React.useRef(null);
  function exportGrid() {
    const doc = new jsPDF();
    const dataGrid = dataGridRef.current.instance;
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid
    }).then(() => {
      doc.save('Customers.pdf');
    });
  }

  const handleValueChangedInvoiceState = (e) => {
    const treeView = (e.component.selectItem && e.component)
      || (treeViewMine && treeViewMine.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || multiValuesInvoiceState;
        values && values.forEach((value) => {
          treeView.selectItem(value);
        });
      }
    }

    if (e.value !== undefined) {
      setMultiValuesInvoiceState(e.value);
    }
  }

  const handleItemSelectionChangedInvoiceState = (e) => {
    console.log("select");
    setMultiValuesInvoiceState(e.component.getSelectedNodeKeys());
    console.log(e);
  }

  const handleChangeInvoiceType = (e) => {
    setInvoiceType(e.value);
  }

  const handleChangeInvoicePeriod = (e) => {
    setInvoicePeriod(e.value);
  }

  const handleChangeTypePeriodPopup = (e) => {
    console.log(e.value);
    setTypePeriodPopup(e.value);
  }

  const buttonDownloadJobOptions = {
    hint: 'Abilita salvataggi automatici',
    icon: "fas fa-hdd"
  };

  const buttonDownloadOptions = {
    icon: "fas fa-download",
    onClick: exportGrid
  };

  const buttonSyncOptions = {
    icon: "fas fa-sync-alt"
  };

  const buttonMoreOptions = {
    icon: "fas fa-ellipsis-v"
  };

  const [isPopupVisible, setPopupVisibility] = React.useState(false);

  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  const buttonForPopup = {
    text: "Compreso tra.. ",
    onClick: function () {
      setPopupVisibility(!isPopupVisible);
      console.log(isPopupVisible)
    }
  }

  const renderContent = () => {
    return (
      <>
        <div className='subititle-popup-interval'>Intervallo</div>
        <SelectBox
          width="225"
          dataSource={optionsPeriodTypePopup}
          displayExpr="name"
          keyExpr="ID"
          onValueChanged={handleChangeTypePeriodPopup}
        />
        <div className='space-date'>
          {
            typePeriodPopup !== undefined &&
            typePeriodPopup.ID === 1 &&
            doubleDateBox()
          }
          {
            typePeriodPopup !== undefined &&
            typePeriodPopup.ID === 2 &&
            uniqueDateBox()
          }
        </div>
      </>
    )
  }

  const now = new Date();
  const doubleDateBox = () => {
    return (
      <>
        <DateBox defaultValue={now}
          type="date" />
        <DateBox defaultValue={now}
          type="date" />
      </>
    );
  }

  const uniqueDateBox = () => {
    return (
      <>
        <DateBox defaultValue={now}
          type="date" />
      </>
    )
  }

  const treeViewRender = () => {
    return (
      <TreeView
        dataSource={optionsInvoiceState}
        ref={node => { setTreeViewMine(node) }}
        dataStructure="plain"
        keyExpr="ID"
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        displayExpr="name"
        selectByClick={true}
        onContentReady={handleValueChangedInvoiceState}
        onItemSelectionChanged={handleItemSelectionChangedInvoiceState}
      />
    );
  }

  const handleContentReadyOfDataGrid = (e) => {
    // ad ogni refresh dei dati si refresha anche la griglia. Quando tutti i dati sono in griglia
    // me li prendo e li metto in uno stato. Mi servono per scorrerli dentro al popup in modalità slider
    setAllDataInGrid(e.component.getDataSource()._store._array);
  }

  const handleRowClick = (e) => {
    setPopupRowDataVisible(true);
    setPopupRowData(e.data);
    setIndexPopupRowData(e.rowIndex)
    console.log(e.rowIndex);
  }

  const handleHidingPopup = () => {
    setPopupRowDataVisible(false);
  }

  // utilizzo useEffect per accorgermi di quando cambia veramente lo stato dell'index e aggiornare i dati nel popup
  React.useEffect(() => {
    setPopupRowData(allDataInGrid[indexPopupRowData]);
  }, [indexPopupRowData]);

  const handleRightArrowClickSliderInvoice = () => {
    if ((indexPopupRowData + 1) <= (allDataInGrid.length - 1)) {
      setIndexPopupRowData(indexPopupRowData + 1);
    } else {
      // non deve far nulla. Disabilitare l'icona graficamente facendo capire all'utente che si è all'ultimo elemento
    }
    // setPopupRowData(allDataInGrid[indexPopupRowData]);
  }

  const handleLeftArrowClickSliderInvoice = () => {
    if ((indexPopupRowData - 1) >= 0) {
      setIndexPopupRowData(indexPopupRowData - 1);
    } else {
      // non deve far nulla. Disabilitare l'icona graficamente facendo capire all'utente che si è al primo elemento
    }
    // setPopupRowData(allDataInGrid[indexPopupRowData]);
  }

  return (
    <div className="App invoice-react">
      <div className='panel-container'>
        <DataGrid
          ref={dataGridRef}
          id="dataGrid"
          dataSource={invoices}
          keyExpr="progressivo"
          className={'dx-card wide-card'}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
          showBorders={true}
          showColumnLines={false}
          showRowLines={true}
          rowAlternationEnabled={true}
          onRowDblClick={handleRowClick}
          onContentReady={handleContentReadyOfDataGrid}
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
              <DropDownBox
                width="225"
                value={multiValuesInvoiceState}
                valueExpr="ID"
                displayExpr="name"
                placeholder="Stato fattura"
                showClearButton={true}
                dataSource={optionsInvoiceState}
                onValueChanged={handleValueChangedInvoiceState}
                contentRender={treeViewRender}
              />
            </Item>
            <Item location="before">
              <SelectBox
                width="225"
                dataSource={optionsInvoiceType}
                displayExpr="name"
                keyExpr="ID"
                placeholder='Fattura'
                onValueChanged={handleChangeInvoiceType}
              />
            </Item>
            <Item location="before">
              <SelectBox
                width="225"
                dataSource={optionsInvoicePeriod}
                displayExpr="name"
                keyExpr="ID"
                defaultValue={"Libero"}
                onValueChanged={handleChangeInvoicePeriod}
              />
            </Item>
            <Item
              widget="dxButton"
              location="after"
              options={buttonDownloadJobOptions}
            />
            <Item
              widget="dxButton"
              location="center"
              options={buttonForPopup}>
            </Item>
            <Item
              widget="dxButton"
              location="after"
              options={buttonDownloadOptions}
            />
            <Item
              widget="dxButton"
              location="after"
              options={buttonSyncOptions}
            />
            <Item
              widget="dxButton"
              location="after"
              options={buttonMoreOptions}
            />
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

          <Column dataField={'progressivo'} allowFiltering={false} caption="Progressivo" />

          <Column
            dataField={'etichette'} allowFiltering={false} caption="Etichette"
          />
          <Column
            dataField={'data_inserimento'}
            dataType={'date'}
            filterOperations={['=', '<=', '>=', 'between']}
          />
          <Column
            dataField={'in_carico_a'} caption="In carico a"
          >
          </Column>
          <Column
            dataField={'data_trasmissione'}
            caption="Data trasmissione"
            dataType={'date'}
          />
          <Column
            dataField={'numero_fattura'}
            caption="Numero fattura"
          />
          <Column
            dataField={'Data fattura'}
            caption={'data_fattura'}
            dataType={'date'}
            allowFiltering={false}
          />
          <Column
            dataField={'p_iva_fornitore'}
            caption="Partita IVA fornitore"
            allowFiltering={false}
          />
          <Column
            caption="CF fornitore"
            dataField={'cf_fornitore'}
          />
          <Column
            caption="Rag. Soc. Fornitore"
            dataField={'rag_soc_fornitore'}
          />
          <Column
            dataField={'P.IVA cliente'}
          />
          <Column
            caption={'cf_cliente'}
            dataField={'CF cliente'}
          />
          <Column
            caption={'Rag. Soc. cliente'}
            dataField={'rag_soc_cliente'}
          />
          <Column
            caption={'Codice cliente'}
            dataField={'codice_cliente'}
          />
          <Column
            dataField={'data_prima_scadenza'}
            caption={'Data prima scadenza'}
            dataType={'date'}
          />
          <Column
            caption={'Totale fattura'}
            dataField={'totale_fattura'}
          />
          <Column
            caption={'Codice valuta'}
            dataField={'codice_valuta'}
          />
          <Column
            caption={'Tipo documento'}
            dataField={'tipo_documento'}
          />
          <Column
            caption={'Formato trasmissione'}
            dataField={'formato_trasmissione'}
            allowFiltering={false}
          />
          <Column
            caption={'Canale principale'}
            dataField={'canale_principale'}
          />
          <Column
            caption={'Fase fattura'}
            dataField={'fase_fattura'}
          />
          <Column
            caption={'Stato fattura'}
            dataField={'stato_fattura'}
            allowFiltering={false}
          />
          <Column
            caption={'Stato conservazione'}
            dataField={'stato_conservazione'}
          />
          <Column
            caption={'Progressivo invio'}
            dataField={'progressivo_invio'}
          />
          <Column
            caption={'Identificativo SDI'}
            dataField={'identificativo_SDI'}
          />
        </DataGrid>
        <Popup
          width={550}
          height={550}
          title={"Scegli l'intervallo"}
          visible={isPopupVisible}
          hideOnOutsideClick={true}
          onHiding={togglePopup}
          contentRender={renderContent}
        />
        <Popup
          visible={popupRowDataVisible}
          onHiding={handleHidingPopup}
          dragEnabled={false}
          hideOnOutsideClick={true}
          showCloseButton={true}
          showTitle={true}
          title={"Fattura n° " + (popupRowData !== undefined && popupRowData.numero_fattura)}
        >
          <div className='arrow-slider-container'>
            <div className='arrow-sx' onClick={handleLeftArrowClickSliderInvoice}>
              <i class="dx-icon fas fa-chevron-left"></i>
            </div>
            <div className='arrow-dx' onClick={handleRightArrowClickSliderInvoice}>
              <i class="dx-icon fas fa-chevron-right"></i>
            </div>
          </div>
          <div className='row-data-container'>
            <div className='item-of-invoice'>
              <h4>PROGRESSIVO</h4>
              <h5>{popupRowData !== undefined && popupRowData.progressivo}</h5>
            </div>
            <div className='item-of-invoice'>
              <h4>ETICHETTE</h4>
              <h5>{popupRowData !== undefined && popupRowData.etichette}</h5>
            </div>
            <div className='item-of-invoice'>
              <h4>DATA INSERIMENTO:</h4>
              <h5>{popupRowData !== undefined && popupRowData.data_inserimento}</h5>
            </div>
            <div className='item-of-invoice'>
              <h4>PIVA FORNITORE</h4>
              <h5>{popupRowData !== undefined && popupRowData.p_iva_fornitore}</h5>
            </div>
            <div className='item-of-invoice'>
              <h4>CF CLIENTE</h4>
              <h5>{popupRowData !== undefined && popupRowData.cf_cliente}</h5>
            </div>
          </div>
        </Popup>
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

const filterValue = [];

export default App;