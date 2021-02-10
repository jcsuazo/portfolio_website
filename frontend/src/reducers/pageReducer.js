import { DISPLAY_FOOTER, HIDE_FOOTER } from '../constants/pageConstans';

export const toggleFooterReducer = (state = { footer: true }, action) => {
  switch (action.type) {
    case DISPLAY_FOOTER:
      return { footer: true };
    case HIDE_FOOTER:
      return { footer: false };
    default:
      return state;
  }
};
