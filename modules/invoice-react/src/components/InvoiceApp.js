import React, { useMemo } from "react";

import '../App.css';
import CustomStore from "devextreme/data/custom_store";
import { inputSearchObj } from "../data/inputSearchObj";
import DataGridStore from "./dataGridStore";
import { Toast } from 'devextreme-react/toast';
import * as Constants from "../utils/constants";


export default function InvoiceApp() {

  const [
    inputSearch,
    setInputSearch,
    isLoading,
    setIsLoading,
    isLoadingSpinnerVisible,
    setIsLoadingSpinnerVisible,
    uriRetrieveCards,
    uriRetrieveCardsGET,
    toastUnauthorizeIsVisible,
    setToastUnauthorizeIsVisible
  ] = useInvoiceApp();

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputSearch)
  };

  const isNotEmpty = (value) => value !== undefined && value !== null && value !== '';

  const customStore = React.useMemo(() => new CustomStore({
    key: 'prog',
    load: async (loadOptions) => {
      let params = '?';

      [
        'filter',
        'group',
        'groupSummary',
        'parentIds',
        'requireGroupCount',
        'requireTotalCount',
        'searchExpr',
        'searchOperation',
        'searchValue',
        'select',
        'sort',
        'skip',
        'take',
        'totalSummary',
        'userData'
      ].forEach(function (i) {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      params = params.slice(0, -1);
      try {
        console.log("reload -->");
        console.log(inputSearch);
        const response = await fetch(uriRetrieveCards, requestOptions);
        const response_1 = await response.json();
        console.log("response_1");
        console.log(response_1);
        const loaded = response_1 !== "" && response_1 !== undefined;
        if (loaded) {
          console.log("avrei finito io")
          setIsLoadingSpinnerVisible(false);
        }
        return {
          data: response_1.cards,
          totalCount: response_1.hitsCount
        };
      } catch {
        setToastUnauthorizeIsVisible(true);
      }
    }
  }), [inputSearch]);

  /*
  * USE EFFECT
  
  React.useEffect(() => {
    console.log("use effect");
    fetchData();
  }, []);
  
  */


  /*
  React.useEffect(() => {
    console.log("use effect POST");
    console.log(inputSearch);
    // fetchData();
    const resp = customStore.load();
    resp.then((res) => {
      setIsLoading(false);
      setIsLoadingSpinnerVisible(false);
    })
  }, [inputSearch]);
  */

  return (
    <div className='panel-container' id="datagrid-invoice">
      <DataGridStore
        customStore={customStore}
        setInputSearch={setInputSearch}
        inputSearch={inputSearch}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        setIsLoadingSpinnerVisible={setIsLoadingSpinnerVisible}
        isLoadingSpinnerVisible={isLoadingSpinnerVisible}
      ></DataGridStore>
      <Toast
        visible={toastUnauthorizeIsVisible}
        message="Mancata autenticazione.. Effettua il login per usufruire del servizio"
        type="error"
        onHiding={() => setToastUnauthorizeIsVisible(false)}
        displayTime={6000}
      />
    </div>
  );
}

const filterBuilder = {
  /*
  customOperations: [{
    name: 'weekends',
    caption: 'Weekends',
    dataTypes: ['date'],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression: () => [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]],
  }],
  allowHierarchicalFields: true,
*/
};

const filterValue = [
  /*['Employee', '=', 'Clark Morgan'], 'and', ['OrderDate', 'weekends']
*/
];

function useInvoiceApp() {
  const [inputSearch, setInputSearch] = React.useState(inputSearchObj);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingSpinnerVisible, setIsLoadingSpinnerVisible] = React.useState(true);
  const [uriRetrieveCards, setUriRetrieveCards] = React.useState(themeDisplay.getPortalURL() + Constants.retriveCardsPOST + "?p_auth=" + Liferay.authToken);
  const [uriRetrieveCardsGET, setUriRetrieveCardsGET] = React.useState(themeDisplay.getPortalURL() + Constants.retrieveCardsGET + "?p_auth=" + Liferay.authToken);
  const [toastUnauthorizeIsVisible, setToastUnauthorizeIsVisible] = React.useState(false);

  return [
    inputSearch,
    setInputSearch,
    isLoading,
    setIsLoading,
    isLoadingSpinnerVisible,
    setIsLoadingSpinnerVisible,
    uriRetrieveCards,
    uriRetrieveCardsGET,
    toastUnauthorizeIsVisible,
    setToastUnauthorizeIsVisible
  ]
}