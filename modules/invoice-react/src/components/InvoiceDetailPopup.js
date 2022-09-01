import React from "react";

import { Button } from 'devextreme-react/button';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

export default function InvoiceDetailPopup(props) {
  const [
    popupRowDataVisible,
    setPopupRowDataVisible,
    handleHidingPopup,
    popupRowData,
    setPopupRowData,
    handleRightArrowClickSliderInvoice,
    handleLeftArrowClickSliderInvoice,
    allDataInGrid,
    indexPopupRowData
  ] = useInvoiceDetailPopup(props);

  // utilizzo useEffect per accorgermi di quando cambia veramente lo stato dell'index e aggiornare i dati nel popup
  React.useEffect(() => {
    setPopupRowData(allDataInGrid[indexPopupRowData]);
  }, [indexPopupRowData]);

  return (
    <Popup
      visible={true}
      onHiding={handleHidingPopup}
      dragEnabled={false}
      hideOnOutsideClick={true}
      showCloseButton={true}
      showTitle={true}
      title={"Fattura n° " + (popupRowData !== undefined && popupRowData.prog) + " - " + (popupRowData !== undefined && popupRowData.fieldTypes[5].value)}
    >
      <div className='arrow-slider-container header-invoice-detail'>
        <div className='arrow-sx' onClick={handleLeftArrowClickSliderInvoice}>
          <i class="dx-icon fas fa-chevron-left"></i>
        </div>
        <div className='arrow-dx' onClick={handleRightArrowClickSliderInvoice}>
          <i class="dx-icon fas fa-chevron-right"></i>
        </div>
        <Button text={"SCARICA"} name="download" hint="Scarica" icon="fdx-icon fas fa-caret-down" />
        <Button text={"INVIA"} name="send" hint="Invia" icon="dx-icon fas fa-envelope" />
        <Button text={"MODIFICA"} name="send" hint="Modifica" icon="dx-icon fas fa-edit" />
      </div>
      <div className='row-data-container invoice-detail'>
        <div className='item-of-invoice'>
          <h5>Numero fattura</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.prog}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Data fattura</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[5].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Totale fattura</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[14].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Codice valuta</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[15].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Formato trasmissione</h5>
          <h4 className='textColorDefault metadata-field'></h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Partita IVA Cliente</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[12].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Codice Fiscale Cliente</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[10].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Rag. Soc. Cliente</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[11].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Rag. Soc. Fornitore</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[8].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Data Trasmissione</h5>
          <h4 className='textColorDefault metadata-field'></h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Data Prima Scadenza</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[13].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Tipo Documento</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[16].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Progressivo Invio</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[22].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Stato Fattura</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[20].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>In carico a</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[2].value}</h4>
        </div>
        <div className='item-of-invoice'>
          <h5>Identificativo SDI</h5>
          <h4 className='textColorDefault metadata-field'>{popupRowData !== undefined && popupRowData.fieldTypes[23].value}</h4>
        </div>
      </div>
      <div className="attachments-announcements">
        <h4>Elenco Ricevute e Comunicazioni SDI</h4>
        <h4>Allegati</h4>
      </div>
    </Popup>
  );
}

function useInvoiceDetailPopup(props) {
  const [popupRowDataVisible, setPopupRowDataVisible] = React.useState(props.popupRowDataVisible);
  const [popupRowData, setPopupRowData] = React.useState(props.popupRowData);
  const [indexPopupRowData, setIndexPopupRowData] = React.useState(props.indexPopupRowData);
  const [allDataInGrid, setAllDataInGrid] = React.useState(props.allDataInGrid);

  const handleHidingPopup = () => {
    setPopupRowDataVisible(false);
    props.popupRowDataVisible = false;
    props.onChange(false);
  }

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

  return [
    popupRowDataVisible,
    setPopupRowDataVisible,
    handleHidingPopup,
    popupRowData,
    setPopupRowData,
    handleRightArrowClickSliderInvoice,
    handleLeftArrowClickSliderInvoice,
    allDataInGrid,
    indexPopupRowData
  ];
}