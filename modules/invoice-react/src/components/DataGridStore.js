import React from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
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
} from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import DateBox from 'devextreme-react/date-box';
import DropDownBox from 'devextreme-react/drop-down-box';
import SelectBox from 'devextreme-react/select-box';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import InvoiceDetailPopup from './InvoiceDetailPopup';
import { ThreeDots } from 'react-loader-spinner';
import { inputSearchObj } from '../data/inputSearchObj';
import { inputSearchObjCurrentMonth } from '../data/inputSearchObjCurrentMonth';
import LoadingSpinner from './LoadingSpinner';

const exportFormats = ['pdf'];
const allowedPageSizes = [10, 20, 50, 100];
const optionsInvoiceState = [
  {
    ID: 1,
    name: 'DA LAVORARE',
  },
  {
    ID: 2,
    name: 'DA FIRMARE',
  },
  {
    ID: 3,
    name: 'CONSEGNATO',
  },
];

const optionsInvoiceType = [
  {
    ID: 1,
    name: 'B2B',
    value: 'FPR12',
  },
  {
    ID: 2,
    name: 'PA',
    value: 'FPA12',
  },
];

const optionsInvoicePeriod = [
  {
    ID: 1,
    name: 'Libero',
  },
  {
    ID: 2,
    name: 'Mese precedente',
  },
];

const optionsPeriodTypePopup = [
  {
    ID: 1,
    name: 'Compreso tra',
  },
  {
    ID: 2,
    name: 'Uguale a',
  },
];

export default function DataGridStore(props) {
  const [
    typePeriodPopup,
    multiValuesInvoiceState,
    setTreeViewMine,
    popupRowDataVisible,
    popupRowData,
    setPopupRowData,
    allDataInGrid,
    indexPopupRowData,
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
    togglePopup,
    invoiceType,
    setInvoiceType,
    invoicePeriod,
    setInvoicePeriod,
    handlePageIndexChange,
    handlePageSizeChange,
    isAttachmentsIconVisible,
    isCommentsIconVisible,
    handleClosedDropboxInvoiceState,
    textModel,
    setTextModel,
  ] = useDataGridStore(props);

  // utilizzo useEffect per accorgermi di quando cambia veramente lo stato dell'index e aggiornare i dati nel popup
  React.useEffect(() => {
    setPopupRowData(allDataInGrid[indexPopupRowData]);
  }, [indexPopupRowData]);

  // EXPORT
  const dataGridRef = React.useRef(null);
  function exportGrid() {
    const doc = new jsPDF();
    const dataGrid = dataGridRef.current.instance;
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid,
    }).then(() => {
      doc.save('Customers.pdf');
    });
  }

  // BOTTONI
  const buttonDownloadJobOptions = {
    hint: 'Abilita salvataggi automatici',
    icon: 'fas fa-hdd',
  };

  const buttonDownloadOptions = {
    icon: 'fas fa-download',
    onClick: exportGrid,
  };

  const buttonSyncOptions = {
    icon: 'fas fa-sync-alt',
  };

  const buttonMoreOptions = {
    icon: 'fas fa-ellipsis-v',
  };

  const buttonForPopup = {
    text: textModel,
    onClick: function () {
      setPopupVisibility(!isPopupVisible);
      console.log(isPopupVisible);
    },
  };

  const renderContent = () => {
    return (
      <>
        <div className="subititle-popup-interval">Intervallo</div>
        <SelectBox
          width="225"
          dataSource={optionsPeriodTypePopup}
          displayExpr="name"
          keyExpr="ID"
          onValueChanged={handleChangeTypePeriodPopup}
        />
        <div className="space-date">
          {typePeriodPopup !== undefined &&
            typePeriodPopup.ID === 1 &&
            doubleDateBox()}
          {typePeriodPopup !== undefined &&
            typePeriodPopup.ID === 2 &&
            uniqueDateBox()}
        </div>
      </>
    );
  };

  const now = new Date();
  const doubleDateBox = () => {
    return (
      <>
        <DateBox defaultValue={now} type="date" />
        <DateBox defaultValue={now} type="date" />
      </>
    );
  };

  const uniqueDateBox = () => {
    return (
      <>
        <DateBox defaultValue={now} type="date" />
      </>
    );
  };

  const treeViewRender = () => {
    return (
      <TreeView
        dataSource={optionsInvoiceState}
        ref={(node) => {
          setTreeViewMine(node);
        }}
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
  };

  const refreshDatagrid = () => {
    // console.log(dataGridRef);
    dataGridRef.current.instance.state(null);
    props.setInputSearch({ ...props.inputSearch, ...inputSearchObj });
  };

  const getCurrentMonthData = () => {
    props.setInputSearch({
      ...props.inputSearch,
      ...inputSearchObjCurrentMonth,
    });
    props.setIsLoadingSpinnerVisible(true);
    setTextModel('Mese Corrente');
  };

  return (
    <>
      <div className="btn-same-tab" onClick={getCurrentMonthData}>
        <span>MESE CORRENTE</span>
        <i class="fas fa-star"></i>
      </div>
      <DataGrid
        ref={dataGridRef}
        id="dataGrid"
        dataSource={props.customStore}
        keyExpr="prog"
        className={'dx-card wide-card'}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        showColumnLines={false}
        showRowLines={true}
        rowAlternationEnabled={true}
        onRowDblClick={handleRowDblClick}
        onContentReady={handleContentReadyOfDataGrid}
        loadPanel={false}
      >
        <RemoteOperations paging={true} groupPaging={true}></RemoteOperations>
        <Selection mode="multiple" selectAllMode={true} deferred={true} />
        <Paging
          defaultPageSize={10}
          onPageIndexChange={handlePageIndexChange}
          onPageSizeChange={handlePageSizeChange}
        />
        <Pager
          visible={true}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
          allowedPageSizes={allowedPageSizes}
        />
        <Export
          enabled={true}
          formats={exportFormats}
          allowExportSelectedData={true}
        />
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
              onClosed={handleClosedDropboxInvoiceState}
            />
          </Item>
          <Item location="before">
            <SelectBox
              width="225"
              dataSource={optionsInvoiceType}
              displayExpr="name"
              keyExpr="ID"
              placeholder="Fattura"
              onValueChanged={handleChangeInvoiceType}
            />
          </Item>
          <Item location="before">
            <SelectBox
              width="225"
              dataSource={optionsInvoicePeriod}
              displayExpr="name"
              keyExpr="ID"
              defaultValue={'Libero'}
              onValueChanged={handleChangeInvoicePeriod}
            />
          </Item>
          <Item
            widget="dxButton"
            location="after"
            options={buttonDownloadJobOptions}
            key={1}
          />
          <Item
            cssClass={'modelname-interval'}
            widget="dxButton"
            location="center"
            options={buttonForPopup}
            key={2}
          ></Item>
          <Item
            widget="dxButton"
            location="after"
            options={buttonDownloadOptions}
            key={3}
          />
          <Item
            widget="dxButton"
            location="after"
            options={buttonSyncOptions}
            onClick={refreshDatagrid}
            key={4}
          />
          <Item
            widget="dxButton"
            location="after"
            options={buttonMoreOptions}
            key={5}
          />
        </Toolbar>
        <HeaderFilter allowSearch={true} visible={true} />
        <Column type="buttons" width={40}>
          <Button
            name="open"
            hint="Dettaglio"
            icon="fas fa-search-plus"
            onClick={handleViewDetailClick}
          />
        </Column>
        <Column type="buttons" width={40}>
          <Button
            name="view-signature-doc"
            hint="Visualizza documento principale in una nuova scheda [Firmato]"
            icon="fas fa-file-signature"
          />
        </Column>
        <Column type="buttons" width={40}>
          <Button
            name=""
            hint="Ricevute e comunicazioni SDI"
            icon="fas fa-stream"
          />
        </Column>
        <Column type="buttons" width={40}>
          <Button
            name="attachments"
            hint="allegati presenti"
            icon="fas fa-paperclip"
            visible={isAttachmentsIconVisible}
          ></Button>
        </Column>
        <Column type="buttons" width={40}>
          <Button
            name="notes"
            hint="note presenti"
            icon="fas fa-comments"
            visible={isCommentsIconVisible}
          ></Button>
        </Column>

        <Column
          caption={'Progressivo'}
          dataField={'prog'}
          allowFiltering={false}
        />
        <Column
          caption={'Etichette'}
          dataField={'additives[0].AdditiveValue'}
          allowFiltering={false}
        />
        <Column
          caption={'Data inserimento'}
          dataField={'fieldTypes[1].value'}
          defaultSelectedFilterOperation=">="
          dataType="date"
        />
        <Column
          caption={'In carico a'}
          dataField={'fieldTypes[2].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Data trasmissione'}
          defaultSelectedFilterOperation=">="
          dataType="date"
        />
        <Column
          caption={'Numero Fattura'}
          dataField={'fieldTypes[4].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Data Fattura'}
          dataField={'fieldTypes[5].value'}
          allowFiltering={false}
        />
        <Column
          caption={'P. IVA FORNITORE'}
          dataField={'fieldTypes[6].value'}
          allowFiltering={false}
        />
        <Column
          caption={'CF FORNITORE'}
          dataField={'fieldTypes[7].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'RAG. SOC. FORNITORE'}
          dataField={'fieldTypes[8].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'P.IVA CLIENTE'}
          dataField={'fieldTypes[9].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'CF CLIENTE'}
          dataField={'fieldTypes[10].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'RAG. SOC. CLIENTE'}
          dataField={'fieldTypes[11].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'P. IVA CLIENTE'}
          dataField={'fieldTypes[12].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Data prima scadenza'}
          dataField={'fieldTypes[14].value'}
          defaultSelectedFilterOperation=">="
        />
        <Column
          caption={'TOTALE FATTURA'}
          dataField={'fieldTypes[15].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Codice valuta'}
          dataField={'fieldTypes[16].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Tipo documento'}
          dataField={'fieldTypes[17].value'}
          defaultSelectedFilterOperation="="
        />
        <Column caption={'Formato trasmissione'} allowFiltering={false} />
        <Column
          caption={'Canale principale'}
          dataField={'fieldTypes[19].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Fase fattura'}
          dataField={'fieldTypes[20].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Stato fattura'}
          dataField={'fieldTypes[21].value'}
          allowFiltering={false}
        />
        <Column
          caption={'Stato conservazione'}
          dataField={'fieldTypes[22].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Progressivo invio'}
          dataField={'fieldTypes[23].value'}
          defaultSelectedFilterOperation="="
        />
        <Column
          caption={'Identificativo SDI'}
          dataField={'fieldTypes[24].value'}
          defaultSelectedFilterOperation="="
        />
      </DataGrid>
      {props.isLoadingSpinnerVisible && <LoadingSpinner />}
      {/*
        <ThreeDots
        height="50"
        width="100"
        radius="9"
        color="#009fe3"
        ariaLabel="three-dots-loading"
        wrapperStyle={{
          position: "absolute",
          width: "calc(100% - 45px)",
          top: "130px",
          justifyContent: "center",
          left: "22px",
          background: "rgb(0 0 0 / 27%)",
          height: "calc(100% - 153px)",
          alignItems: "center"
        }}
        wrapperClassName="three-dots-loading"
        visible={props.isLoadingSpinnerVisible}
      />
        */}

      <Popup
        width={550}
        height={550}
        title={"Scegli l'intervallo"}
        visible={isPopupVisible}
        hideOnOutsideClick={true}
        onHiding={togglePopup}
        contentRender={renderContent}
      />

      {popupRowDataVisible && (
        <div>
          <InvoiceDetailPopup
            allDataInGrid={allDataInGrid}
            popupRowData={popupRowData}
            popupRowDataVisible={popupRowDataVisible}
            indexPopupRowData={indexPopupRowData}
            onChange={handleChange}
          />
        </div>
      )}
    </>
  );
}

function useDataGridStore(props) {
  const [typePeriodPopup, setTypePeriodPopup] = React.useState();
  const [multiValuesInvoiceState, setMultiValuesInvoiceState] = React.useState(
    []
  );
  const [treeViewMine, setTreeViewMine] = React.useState();
  const [popupRowDataVisible, setPopupRowDataVisible] = React.useState(false);
  const [popupRowData, setPopupRowData] = React.useState();
  const [allDataInGrid, setAllDataInGrid] = React.useState([]);
  const [indexPopupRowData, setIndexPopupRowData] = React.useState(0);
  const [isPopupVisible, setPopupVisibility] = React.useState(false);
  const [invoiceType, setInvoiceType] = React.useState();
  const [invoicePeriod, setInvoicePeriod] = React.useState();
  const [input, setInput] = React.useState(props.inputSearch);
  const [textModel, setTextModel] = React.useState(
    'Compreso tra 1/1/2018 : 31/12/2018'
  );

  /*
  const getInvoiceData = async () => {
    console.log("async call " + uriRetrieveCardsGET)
    axios.get(uriRetrieveCardsGET).then(res => {
      setInvoiceData(res.data);
      console.log(res);
      props.setIsLoading(false);
    }).catch(err => {
      // Handle error unauthorize
      if (err.message.indexOf("403") !== -1) {
        props.setIsLoadingSpinnerVisible(false);
        setToastUnauthorizeIsVisible(true);
      }
    });;
  };

  const fetchData = async () => {
    try {
      const dataPosts = await axios.post(uriRetrieveCards,
        props.inputSearch
      );
      console.log("result post");
      console.log(dataPosts.data);
      setInvoiceData(dataPosts.data);
      props.setIsLoading(false);
    } catch (err) {
      if (err.message.indexOf("403") !== -1) {
        props.setIsLoadingSpinnerVisible(false);
        setToastUnauthorizeIsVisible(true);
      }
    }
  };
  */

  const isAttachmentsIconVisible = (e) => {
    return e.row.data.hasAttachments;
  };

  const isCommentsIconVisible = (e) => {
    return e.row.data.hasNotes;
  };

  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  // cambio di stato nella multiselection dello stato fattura
  const handleValueChangedInvoiceState = (e) => {
    console.log('change invoice state');
    const treeView =
      (e.component.selectItem && e.component) ||
      (treeViewMine && treeViewMine.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || multiValuesInvoiceState;
        values &&
          values.forEach((value) => {
            treeView.selectItem(value);
          });
      }
    }

    if (e.value !== undefined) {
      const prev = e.previousValue;
      const val = e.value;

      if (val !== undefined && val !== null) {
        const arrValueToObjInput = optionsInvoiceState.filter((it) =>
          val.includes(it.ID)
        );
        const valueToObjInput = arrValueToObjInput.reduce(
          (accumulator, item) => (accumulator += item.name + ','),
          ''
        );
        localStorage.setItem(
          'valueToObjInput',
          valueToObjInput.substring(0, valueToObjInput.length - 1)
        );
        console.log(localStorage.getItem('valueToObjInput'));
      }
      setMultiValuesInvoiceState(e.value);
    }
  };

  const handleClosedDropboxInvoiceState = () => {
    const stateToInputStr = localStorage.getItem('valueToObjInput');
    const nextInputSearchFields = [
      ...props.inputSearch.paramIn.SearchCriteria.Fields,
      {
        FieldValueTo: stateToInputStr,
        FieldId: '21',
        FieldValue: stateToInputStr,
      },
    ];
    const nextInputSearchSearchCriteria = {
      ...props.inputSearch.paramIn.SearchCriteria,
      Fields: nextInputSearchFields,
    };
    const nextInputSearchParamIn = {
      ...props.inputSearch.paramIn,
      SearchCriteria: nextInputSearchSearchCriteria,
    };
    props.setInputSearch({
      ...props.inputSearch,
      paramIn: nextInputSearchParamIn,
    });
    props.setIsLoadingSpinnerVisible(true);
  };

  const handleChange = (newValue) => {
    setPopupRowDataVisible(newValue);
  };

  const handleItemSelectionChangedInvoiceState = (e) => {
    // const isPresent = multiValuesInvoiceState.filter((item) => item !== undefined && item === e.itemData.ID)
    setMultiValuesInvoiceState(e.component.getSelectedNodeKeys());
    //console.log(isPresent);
    console.log(e);
  };

  const handlePageIndexChange = (e) => {
    let index = e + 1;
    console.log('nuovo indice ' + index);
    const nextInputSearchParamIn = {
      ...props.inputSearch.paramIn,
      PageNumber: index,
    };
    console.log(nextInputSearchParamIn);
    props.setInputSearch({
      ...props.inputSearch,
      paramIn: nextInputSearchParamIn,
    });
    props.setIsLoadingSpinnerVisible(true);
  };

  const handlePageSizeChange = (e) => {
    let size = e;
    console.log('nuova dimensione ' + size);
    const nextInputSearchParamIn = {
      ...props.inputSearch.paramIn,
      PageSize: size,
    };
    console.log(nextInputSearchParamIn);
    props.setInputSearch({
      ...props.inputSearch,
      paramIn: nextInputSearchParamIn,
    });
    props.setIsLoadingSpinnerVisible(true);
  };

  const handleChangeInvoiceType = (e) => {
    const nextInputSearchFields = [
      ...props.inputSearch.paramIn.SearchCriteria.Fields,
      {
        FieldValueTo: e.value.value,
        FieldId: '18',
        FieldValue: e.value.value,
      },
    ];

    const nextInputSearchSearchCriteria = {
      ...props.inputSearch.paramIn.SearchCriteria,
      Fields: nextInputSearchFields,
    };
    const nextInputSearchParamIn = {
      ...props.inputSearch.paramIn,
      SearchCriteria: nextInputSearchSearchCriteria,
    };
    props.setInputSearch({
      ...props.inputSearch,
      paramIn: nextInputSearchParamIn,
    });
    props.setIsLoadingSpinnerVisible(true);
    setInvoiceType(e.value);
  };

  const handleChangeInvoicePeriod = (e) => {
    setInvoicePeriod(e.value);
  };

  const handleChangeTypePeriodPopup = (e) => {
    console.log(e.value);
    setTypePeriodPopup(e.value);
  };

  const handleContentReadyOfDataGrid = (e) => {
    // ad ogni refresh dei dati si refresha anche la griglia. Quando tutti i dati sono in griglia
    // me li prendo e li metto in uno stato. Mi servono per scorrerli dentro al popup in modalità slider
    // console.log(e.component.getDataSource());
    setAllDataInGrid(e.component.getDataSource()._items);
  };

  // gestisce click su icona di dettaglio
  const handleViewDetailClick = (e) => {
    setPopupRowData(e.row.data);
    setIndexPopupRowData(e.row.rowIndex);
    setPopupRowDataVisible(true);
  };

  // gestisce doppio click generico sulla riga
  const handleRowDblClick = (e) => {
    console.log(e);
    setPopupRowData(e.data);
    setIndexPopupRowData(e.rowIndex);
    setPopupRowDataVisible(true);
  };

  return [
    typePeriodPopup,
    multiValuesInvoiceState,
    setTreeViewMine,
    popupRowDataVisible,
    popupRowData,
    setPopupRowData,
    allDataInGrid,
    indexPopupRowData,
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
    togglePopup,
    invoiceType,
    setInvoiceType,
    invoicePeriod,
    setInvoicePeriod,
    handlePageIndexChange,
    handlePageSizeChange,
    isAttachmentsIconVisible,
    isCommentsIconVisible,
    handleClosedDropboxInvoiceState,
    textModel,
    setTextModel,
  ];
}
