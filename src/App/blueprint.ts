import * as BP from '@blueprintjs/core';
import styled, { StyledComponent } from 'styled-components';
import { space, position, flexbox, typography, layout } from 'styled-system';

export const Text: StyledComponent<typeof BP.Text, any, {}, never> = styled(BP.Text)`
  ${space} ${typography} ${layout}
`;
export const H1: StyledComponent<typeof BP.H1, any, {}, never> = styled(BP.H1)`
  ${space} ${typography} ${layout}
`;
export const H2: StyledComponent<typeof BP.H2, any, {}, never> = styled(BP.H2)`
  ${space} ${typography} ${layout}
`;
export const H3: StyledComponent<typeof BP.H3, any, {}, never> = styled(BP.H3)`
  ${space} ${typography} ${layout}
`;
export const H4: StyledComponent<typeof BP.H4, any, {}, never> = styled(BP.H4)`
  ${space} ${typography} ${layout}
`;
export const H5: StyledComponent<typeof BP.H5, any, {}, never> = styled(BP.H5)`
  ${space} ${typography} ${layout}
`;
export const H6: StyledComponent<typeof BP.H6, any, {}, never> = styled(BP.H6)`
  ${space} ${typography} ${layout}
`;
export const Button: StyledComponent<typeof BP.Button, any, {}, never> = styled(BP.Button)`
  ${space} ${layout} ${position}
`;
export const ButtonGroup: StyledComponent<typeof BP.ButtonGroup, any, {}, never> = styled(BP.ButtonGroup)`
  ${space} ${layout} ${position}
`;
export const Icon: StyledComponent<typeof BP.Icon, any, {}, never> = styled(BP.Icon)`
  ${space} ${layout} ${position}
`;
export const Card: StyledComponent<typeof BP.Card, any, {}, never> = styled(BP.Card)`
  ${space} ${layout} ${flexbox}
`;
export const Checkbox: StyledComponent<typeof BP.Checkbox, any, {}, never> = styled(BP.Checkbox)`
  ${space} ${layout} ${flexbox}
`;
export const Radio: StyledComponent<typeof BP.Radio, any, {}, never> = styled(BP.Radio)`
  ${space} ${layout} ${flexbox}
`;
export const HTMLSelect: StyledComponent<typeof BP.HTMLSelect, any, {}, never> = styled(BP.HTMLSelect)`
  ${space} ${layout} ${flexbox}
`;
export const Tag: StyledComponent<typeof BP.Tag, any, {}, never> = styled(BP.Tag)`
  ${space} ${layout} ${flexbox} ${position}
`;

export const Colors: { [x: string]: string } = {
	logo: '#006666',
	background1: '#30404d',
	background2: '#293742',
	background3: '#28323a',
};