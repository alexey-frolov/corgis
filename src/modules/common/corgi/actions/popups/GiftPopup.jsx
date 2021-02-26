import React from 'react';
import PropTypes from 'prop-types';

import { Button, PopupWrapper } from '~modules/common';
import { Transfer } from '~modules/common/corgi';

import { ACTION_MESSAGES } from '~constants/corgi';

import { CorgiType } from '~types/CorgiTypes';

const {
  GIFT: { POPUP_TITLE, BUTTON_DESCRIPTION },
} = ACTION_MESSAGES;

const GiftPopupPropTypes = { id: CorgiType.id.isRequired, asButton: PropTypes.bool };

const GiftPopup = ({ id, asButton = false }) => (
  <PopupWrapper
    popup={{ title: POPUP_TITLE, position: asButton ? 'top' : 'bottom-left', children: <Transfer id={id} /> }}
  >
    {asButton ? <Button description={BUTTON_DESCRIPTION} /> : <span>{BUTTON_DESCRIPTION}</span>}
  </PopupWrapper>
);

GiftPopup.propTypes = GiftPopupPropTypes;

export default GiftPopup;
