import React from "react";

import '../App.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import {
  DataGrid,
  Column,
  Pager,
  Paging,
  Export,
  FilterRow,
  FilterPanel,
  Selection,
  HeaderFilter,
  FilterBuilderPopup,
  Toolbar,
  Button,
  Item
} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import DateBox from 'devextreme-react/date-box';
import DropDownBox from 'devextreme-react/drop-down-box';
import SelectBox from 'devextreme-react/select-box';
import { invoices } from '../data/invoices';
import { invoicesFromWS } from '../data/invoicesFromWS';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import InvoiceDetailPopup from './InvoiceDetailPopup';
import axios from "axios";
import Loading from "./Loading";

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


export default function InvoiceApp() {
  const [invoiceState, setInvoiceState] = React.useState();
  const [invoiceType, setInvoiceType] = React.useState();
  const [invoicePeriod, setInvoicePeriod] = React.useState();
  const [typePeriodPopup, setTypePeriodPopup] = React.useState();
  const [multiValuesInvoiceState, setMultiValuesInvoiceState] = React.useState([1]);
  const [treeViewMine, setTreeViewMine] = React.useState();
  const [popupRowDataVisible, setPopupRowDataVisible] = React.useState(false);
  const [popupRowData, setPopupRowData] = React.useState();
  const [allDataInGrid, setAllDataInGrid] = React.useState([]);
  const [indexPopupRowData, setIndexPopupRowData] = React.useState(0);
  const [loadPanelVisible, setLoadPanelVisible] = React.useState(true);

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

  const [invoiceData, setInvoiceData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  let uri = "";

  const getInvoiceData = async () => {
    console.log("async call")
    const responseInvoiceData = await axios(uri);
    setIsLoading(false);
    setLoadPanelVisible(false)
    setInvoiceData(responseInvoiceData.data);
  };

  React.useEffect(() => {
    console.log("uri");
    uri = themeDisplay.getPortalURL() + "/o/proxy-service-hub/getCardsByParam?p_auth=" + Liferay.authToken;
    console.log(uri);
    getInvoiceData();
  }, []);

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

  const openPopupInvoiceDetail = () => {
    return (
      <InvoiceDetailPopup
        data={popupRowData}
        indexRow={indexPopupRowData}
        allDataInGrid={allDataInGrid}
        popupRowDataVisible={popupRowDataVisible}>
      </InvoiceDetailPopup>
    );
  }

  const handleContentReadyOfDataGrid = (e) => {
    // ad ogni refresh dei dati si refresha anche la griglia. Quando tutti i dati sono in griglia
    // me li prendo e li metto in uno stato. Mi servono per scorrerli dentro al popup in modalità slider
    setAllDataInGrid(e.component.getDataSource()._store._array);
  }

  // gestisce click su icona di dettaglio
  const handleViewDetailClick = (e) => {
    setPopupRowDataVisible(true);
    setPopupRowData(e.row.data);
    setIndexPopupRowData(e.row.rowIndex);
  }

  // gestisce doppio click generico sulla riga
  const handleRowClick = (e) => {
    setPopupRowDataVisible(true);
    setPopupRowData(e.data);
    setIndexPopupRowData(e.rowIndex)
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

  /*
  const handleChange = React.useCallback((newValue) => {
    setPopupRowDataVisible(newValue);
  }, []);
  */

  const handleChange = (newValue) => {
    setPopupRowDataVisible(newValue);
  }

  const calculateCellValue = (e) => {
    console.log(e);
  }

  const position = { of: '#datagrid-invoice' };

  return (
    <div className='panel-container' id="datagrid-invoice">
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        position={position}
        // onHiding={this.hideLoadPanel}
        visible={loadPanelVisible}
        showIndicator={true}
        shading={false}
        // showPane={true}
        // hideOnOutsideClick={hideOnOutsideClick}
        height={200}
        width={400}
      >
      </LoadPanel>

      {isLoading ? <div style={{display: "none"}}></div>
        :
        <DataGrid
          ref={dataGridRef}
          id="dataGrid"
          dataSource={invoiceData.RetrieveCardsByParamResult.Cards}
          keyExpr="CardProg"
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
            <Button name="open" hint="Dettaglio" icon="fas fa-search-plus" onClick={handleViewDetailClick} />
            <Button name="view-signature-doc" hint="Visualizza documento principale in una nuova scheda [Firmato]" icon="fas fa-file-signature" />
            <Button name="" hint="Ricevute e comunicazioni SDI" icon="fas fa-stream" />
          </Column>

          <Column
            caption={'CardProg'}
            dataField={'CardProg'}
          />
          <Column
            caption={'Etichette'}
          />
          <Column
            caption={'Data inserimento'}
            dataField={'Indexes[1].FieldValue'}
          />
          <Column
            caption={'In carico a'}
            dataField={'Indexes[2].FieldValue'}
          />
          <Column
            caption={'Data trasmissione'}
            dataField={'Indexes[3].FieldValue'}
          />
          <Column
            caption={'Numero Fattura'}
            dataField={'Indexes[4].FieldValue'}
          />
          <Column
            caption={'Data Fattura'}
            dataField={'Indexes[5].FieldValue'}
          />
          <Column
            caption={'P. IVA FORNITORE'}
            dataField={'Indexes[9].FieldValue'}
          />
          <Column
            caption={'CF FORNITORE'}
            dataField={'Indexes[10].FieldValue'}
          />
          <Column
            caption={'RAG. SOC. FORNITORE'}
            dataField={'Indexes[11].FieldValue'}
          />
          <Column
            caption={'Data prima scadenza'}
            dataField={'Indexes[14].FieldValue'}
          />
          <Column
            caption={'TOTALE FATTURA'}
            dataField={'Indexes[15].FieldValue'}
          />
          <Column
            caption={'Codice valuta'}
            dataField={'Indexes[16].FieldValue'}
          />
          <Column
            caption={'Tipo documento'}
            dataField={'Indexes[17].FieldValue'}
          />
          <Column
            caption={'Formato trasmissione'}
            dataField={'Indexes[23].FieldValue'}
          />
          <Column
            caption={'Canale principale'}
            dataField={'Indexes[19].FieldValue'}
          />
          <Column
            caption={'Fase fattura'}
            dataField={'Indexes[20].FieldValue'}
          />
          <Column
            caption={'Stato fattura'}
            dataField={'Indexes[21].FieldValue'}
          />
          <Column
            caption={'Stato conservazione'}
            dataField={'Indexes[22].FieldValue'}
          />

        </DataGrid>
      }
      <Popup
        width={550}
        height={550}
        title={"Scegli l'intervallo"}
        visible={isPopupVisible}
        hideOnOutsideClick={true}
        onHiding={togglePopup}
        contentRender={renderContent}
      />

      {popupRowDataVisible &&
        <div>
          <InvoiceDetailPopup
            allDataInGrid={allDataInGrid}
            popupRowData={popupRowData}
            popupRowDataVisible={popupRowDataVisible}
            indexPopupRowData={indexPopupRowData}
            onChange={handleChange} />
        </div>
      }
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