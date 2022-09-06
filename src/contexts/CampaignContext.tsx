import { createContext, useReducer, useContext } from 'react';
import api from '../utils/api';
import { ERROR, MESSAGE_CAMPAIGN_CREATE_SUCCESS, SUCCESS } from '../utils/constants';
import { ICampaign, ICampaignReq } from '../utils/interfaces';
import { AlertMessageContext } from './AlertMessageContext';

/* --------------------------------------------------------------- */

interface IInitialState {
  campaign: ICampaign | null;
  campaigns: Array<ICampaign>;
}

interface IAction {
  type: string,
  payload: any
}

interface IProps {
  children: any
}

interface IHandlers {
  [key: string]: Function,
}

/* --------------------------------------------------------------- */

const initialState: IInitialState = {
  campaign: null,
  campaigns: []
};

const handlers: IHandlers = {
  SET_CAMPAIGN: (state: object, action: IAction) => {
    return {
      ...state,
      campaign: action.payload
    };
  },
  SET_CAMPAIGNS: (state: object, action: IAction) => {
    return {
      ...state,
      campaigns: action.payload
    };
  }
};

const reducer = (state: object, action: IAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const CampaignContext = createContext({
  ...initialState,
  saveCampaignAct: (reqData: ICampaignReq, id?: number) => Promise.resolve(),
});

//  Provider
function CampaignProvider({ children }: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { openAlert } = useContext(AlertMessageContext)

  const saveCampaignAct = (reqData: ICampaignReq, id?: number) => {
    if (id) {
      /* --------------- Edit campaign ----------------- */
      
      /* ----------------------------------------------- */
    } else {
      /* --------------- Create campaign --------------- */
      api.post('/campaign/create', reqData)
        .then(response => {
          console.log('>>>>>> campaigns => ', response.data)
          dispatch({
            type: 'SET_CAMPAIGNS',
            payload: response.data
          })
          openAlert({
            severity: SUCCESS,
            message: MESSAGE_CAMPAIGN_CREATE_SUCCESS
          })
        })
        .catch(error => {
          openAlert({
            severity: ERROR,
            message: error.response.data
          })
        })
      /* ----------------------------------------------- */
    }
  }

  return (
    <CampaignContext.Provider
      value={{
        ...state,
        saveCampaignAct
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export { CampaignContext, CampaignProvider };