import { DISPLAY_FOOTER, HIDE_FOOTER } from '../constants/pageConstans';

export const hideFooter = () => async (dispatch) => {
  dispatch({
    type: HIDE_FOOTER,
  });
};
export const showFooter = () => async (dispatch) => {
  dispatch({
    type: DISPLAY_FOOTER,
  });
};
