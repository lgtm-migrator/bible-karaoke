import React from 'react';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import { position } from 'styled-system';
import { Tooltip } from '@blueprintjs/core';
import { Box } from 'reflexbox';
import { Button } from '../blueprint';
import { useStores } from '../store';
import { TEXT_LOCATION } from '../constants';

const Wrapper = styled(Box)`
  ${position}
  position: absolute;
  line-height: 1;
  .bp3-popover-target {
    display: block;
  }
`;

export default function TextLocationToggle(props: any): JSX.Element {
  const { appState } = useStores();
  const toggleTextLocation = React.useCallback(() => {
    appState.setTextLocation({
      location:
        appState.textLocation.location === TEXT_LOCATION.subtitle ? TEXT_LOCATION.center : TEXT_LOCATION.subtitle,
    });
  }, [appState]);
  return useObserver(() => {
    const isSubtitle = appState.textLocation.location === TEXT_LOCATION.subtitle;
    return (
      <Wrapper {...props}>
        <Tooltip content={isSubtitle ? 'Switch to centered mode' : 'Switch to subtitle mode'}>
          <Button minimal icon={isSubtitle ? 'arrow-up' : 'arrow-down'} onClick={toggleTextLocation} />
        </Tooltip>
      </Wrapper>
    );
  });
}
