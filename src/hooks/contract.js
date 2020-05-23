import { useContext, useReducer, useCallback } from "react";
import { NearContext } from "../context/NearContext";
import Big from "big.js";

const BOATLOAD_OF_GAS = Big(1)
  .times(10 ** 16)
  .toFixed();

const initialState = {
  loading: false,
  error: null,
  corgis: [],
  create: false,
  transfer: false,
  deleting: false,
  corgi: null,
  id: null,
  displayCorgis: [],
};

const contractReducer = (currentState, action) => {
  switch (action.type) {
    case "START":
      return {
        ...currentState,
        loading: true,
      };
    case "FAIL":
      return {
        ...currentState,
        loading: false,
        error: action.error,
      };
    case "GET_DISPLAY_CORGIS":
      return {
        ...currentState,
        loading: false,
        displayCorgis: action.corgis,
      };
    case "GET_CORGISLIST_SUCCESS":
      return {
        ...currentState,
        loading: false,
        corgis: action.corgi,
      };
    case "GET_CORGI_SUCCESS":
      return {
        ...currentState,
        loading: false,
        corgi: action.corgi,
        id: action.id,
      };
    case "CREATE_CORGI_SUCCESS":
      return {
        ...currentState,
        loading: false,
        create: true,
      };
    case "TRANSFER_CORGI_SUCCESS":
      return {
        ...currentState,
        loading: false,
        transfer: true,
      };
    case "DELETE_START":
      return {
        ...currentState,
        deleting: true,
      };
    case "DELETE_CORGI_SUCCESS":
      return {
        ...currentState,
        deleting: false,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useContract = () => {
  const nearContext = useContext(NearContext);
  const Contract = nearContext.nearContract;
  const [contractState, dispatchContract] = useReducer(
    contractReducer,
    initialState
  );

  const clear = useCallback(() => dispatchContract({ type: "CLEAR" }), []);

  const createCorgi = useCallback(
    (name, color, backgroundColor, quote) => {
      dispatchContract({ type: "START" });
      Contract.createCorgi(
        { name, color, backgroundColor, quote },
        BOATLOAD_OF_GAS
      )
        .then(() => dispatchContract({ type: "CREATE_CORGI_SUCCESS" }))
        .catch((error) => dispatchContract({ type: "FAIL", error }));
    },
    [Contract]
  );

  const transferCorgi = useCallback(
    (receiver, id, message) => {
      dispatchContract({ type: "START" });
      Contract.transferCorgi({ receiver, id, message }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: "TRANSFER_CORGI_SUCCESS" }))
        .catch((error) => dispatchContract({ type: "FAIL", error }));
    },
    [Contract]
  );

  const deleteCorgi = useCallback(
    (id) => {
      dispatchContract({ type: "DELETE_START" });
      Contract.deleteCorgi({ id }, BOATLOAD_OF_GAS)
        .then(() => dispatchContract({ type: "DELETE_CORGI_SUCCESS" }))
        .catch((error) => dispatchContract({ type: "FAIL", error }));
    },
    [Contract]
  );

  const getCorgisList = useCallback(
    (owner) => {
      dispatchContract({ type: "START" });
      Contract.getCorgisList({ owner })
        .then((corgis) =>
          dispatchContract({ type: "GET_CORGISLIST_SUCCESS", corgis })
        )
        .catch((error) => dispatchContract({ type: "FAIL", error }));
    },
    [Contract]
  );

  const getCorgi = useCallback(
    (id) => {
      dispatchContract({ type: "START" });
      Contract.getCorgi({ id })
        .then((corgi) =>
          dispatchContract({ type: "GET_CORGI_SUCCESS", corgi, id: corgi.id })
        )
        .catch((error) => dispatchContract({ type: "FAIL", error }));
    },
    [Contract]
  );

  const getDisplayCorgis = useCallback(() => {
    dispatchContract({ type: "START" });
    Contract.displayGolbalCorgis()
      .then((corgis) =>
        dispatchContract({ type: "GET_DISPLAY_CORGIS", corgis })
      )
      .catch((error) => dispatchContract({ type: "FAIL", error }));
  }, [Contract]);

  return {
    loading: contractState.loading,
    error: contractState.error,
    corgis: contractState.corgis,
    displayCorgis: contractState.displayCorgis,
    create: contractState.create,
    transfer: contractState.transfer,
    deleting: contractState.deleting,
    corgi: contractState.corgi,
    id: contractState.id,
    clear,
    getCorgi,
    getCorgisList,
    createCorgi,
    deleteCorgi,
    transferCorgi,
    getDisplayCorgis,
  };
};

export default useContract;
