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
import { inputSearchObj } from "../data/inputSearchObj";

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

  const [
    invoiceState,
    setInvoiceState,
    invoiceType,
    setInvoiceType,
    invoicePeriod,
    setInvoicePeriod,
    typePeriodPopup,
    setTypePeriodPopup,
    multiValuesInvoiceState,
    setMultiValuesInvoiceState,
    treeViewMine,
    setTreeViewMine,
    popupRowDataVisible,
    setPopupRowDataVisible,
    popupRowData,
    setPopupRowData,
    allDataInGrid,
    setAllDataInGrid,
    indexPopupRowData,
    setIndexPopupRowData,
    loadPanelVisible,
    setLoadPanelVisible,
    invoiceData,
    setInvoiceData,
    isLoading,
    setIsLoading,
    uriRetrieveCards,
    getInvoiceData,
    handleContentReadyOfDataGrid,
    handleViewDetailClick,
    handleRowDblClick,
    handleItemSelectionChangedInvoiceState,
    handleChangeInvoiceType,
    handleChangeInvoicePeriod,
    handleChangeTypePeriodPopup,
    handleChange,
    handleValueChangedInvoiceState,
    isPopupVisible,
    setPopupVisibility,
    togglePopup
  ] = useInvoiceApp();

  /*
  * USE EFFECT
  */
  React.useEffect(() => {
    console.log(uriRetrieveCards);
    getInvoiceData();
  }, []);

  // utilizzo useEffect per accorgermi di quando cambia veramente lo stato dell'index e aggiornare i dati nel popup
  React.useEffect(() => {
    setPopupRowData(allDataInGrid[indexPopupRowData]);
  }, [indexPopupRowData]);

  /*
  *
  */

  // EXPORT
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

  // BOTTONI
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

      {isLoading ? <div style={{ display: "none" }}></div>
        :
        <DataGrid
          ref={dataGridRef}
          id="dataGrid"
          dataSource={invoiceData.cards}
          keyExpr="prog"
          className={'dx-card wide-card'}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
          showBorders={true}
          showColumnLines={false}
          showRowLines={true}
          rowAlternationEnabled={true}
          onRowDblClick={handleRowDblClick}
          onContentReady={handleContentReadyOfDataGrid}
        >
          <Selection mode="multiple" selectAllMode={true} deferred={true} />
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true} />
          <Export enabled={true} formats={exportFormats} allowExportSelectedData={true} />
          <FilterRow visible={true} />
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
            caption={'Progressivo'}
            dataField={'prog'}
          />
          <Column
            caption={'Etichette'}
            dataField={'additives[0].AdditiveValue'}
          />
          <Column
            caption={'Data inserimento'}
            dataField={'fieldTypes[1].value'}
          />
          <Column
            caption={'In carico a'}
            dataField={'fieldTypes[2].value'}
          />
          <Column
            caption={'Data trasmissione'}
          />
          <Column
            caption={'Numero Fattura'}
            dataField={'fieldTypes[4].value'}
          />
          <Column
            caption={'Data Fattura'}
            dataField={'fieldTypes[5].value'}
          />
          <Column
            caption={'P. IVA FORNITORE'}
            dataField={'fieldTypes[6].value'}
          />
          <Column
            caption={'CF FORNITORE'}
            dataField={'fieldTypes[7].value'}
          />
          <Column
            caption={'RAG. SOC. FORNITORE'}
            dataField={'fieldTypes[8].value'}
          />
          <Column
            caption={'P.IVA CLIENTE'}
            dataField={'fieldTypes[9].value'}
          />
          <Column
            caption={'CF CLIENTE'}
            dataField={'fieldTypes[10].value'}
          />
          <Column
            caption={'RAG. SOC. CLIENTE'}
            dataField={'fieldTypes[11].value'}
          />
          <Column
            caption={'P. IVA CLIENTE'}
            dataField={'fieldTypes[12].value'}
          />
          <Column
            caption={'Data prima scadenza'}
            dataField={'fieldTypes[14].value'}
          />
          <Column
            caption={'TOTALE FATTURA'}
            dataField={'fieldTypes[15].value'}
          />
          <Column
            caption={'Codice valuta'}
            dataField={'fieldTypes[16].value'}
          />
          <Column
            caption={'Tipo documento'}
            dataField={'fieldTypes[17].value'}
          />
          <Column
            caption={'Formato trasmissione'}

          />
          <Column
            caption={'Canale principale'}
            dataField={'fieldTypes[19].value'}
          />
          <Column
            caption={'Fase fattura'}
            dataField={'fieldTypes[20].value'}
          />
          <Column
            caption={'Stato fattura'}
            dataField={'fieldTypes[21].value'}
          />
          <Column
            caption={'Stato conservazione'}
            dataField={'fieldTypes[22].value'}
          />
          <Column
            caption={'Progressivo invio'}
            dataField={'fieldTypes[23].value'}
          />
          <Column
            caption={'Identificativo SDI'}
            dataField={'fieldTypes[24].value'}
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

function useInvoiceApp(props) {
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
  const [invoiceData, setInvoiceData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [uriRetrieveCards, setUriRetrieveCards] = React.useState(themeDisplay.getPortalURL() + "/o/proxy-service-hub/retrieveCardsByParamGet?p_auth=" + Liferay.authToken);
  const [isPopupVisible, setPopupVisibility] = React.useState(false);
  const [inputSearch, setInputSearch] = React.useState(inputSearchObj);


  const getInvoiceData = async () => {
    console.log("async call")
    axios.get(uriRetrieveCards).then(res => {
      setInvoiceData(res.data);
      console.log(res);
      setIsLoading(false);
      setLoadPanelVisible(false)
    });
  };

  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  // cambio di stato nella multiselection dello stato fattura
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

  const handleChange = (newValue) => {
    setPopupRowDataVisible(newValue);
  }

  const handleItemSelectionChangedInvoiceState = (e) => {
    setMultiValuesInvoiceState(e.component.getSelectedNodeKeys());
    // console.log(e);
    // console.log(e.component.getSelectedNodeKeys())
    inputSearch.paramIn.SearchCriteria.Fields.push({
      "FieldValueTo": "'DA LAVORARE'",
      "FieldId": "21",
      "FieldValue": "'DA LAVORARE'"
    });
    console.log(inputSearch);
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
  const handleRowDblClick = (e) => {
    console.log(e);
    setPopupRowDataVisible(true);
    setPopupRowData(e.data);
    setIndexPopupRowData(e.rowIndex)
  }

  return [
    invoiceState,
    setInvoiceState,
    invoiceType,
    setInvoiceType,
    invoicePeriod,
    setInvoicePeriod,
    typePeriodPopup,
    setTypePeriodPopup,
    multiValuesInvoiceState,
    setMultiValuesInvoiceState,
    treeViewMine,
    setTreeViewMine,
    popupRowDataVisible,
    setPopupRowDataVisible,
    popupRowData,
    setPopupRowData,
    allDataInGrid,
    setAllDataInGrid,
    indexPopupRowData,
    setIndexPopupRowData,
    loadPanelVisible,
    setLoadPanelVisible,
    invoiceData,
    setInvoiceData,
    isLoading,
    setIsLoading,
    uriRetrieveCards,
    getInvoiceData,
    handleContentReadyOfDataGrid,
    handleViewDetailClick,
    handleRowDblClick,
    handleItemSelectionChangedInvoiceState,
    handleChangeInvoiceType,
    handleChangeInvoicePeriod,
    handleChangeTypePeriodPopup,
    handleChange,
    handleValueChangedInvoiceState,
    isPopupVisible,
    setPopupVisibility,
    togglePopup
  ]
}