import { Theme } from '@mui/material/styles';
//
import Menu from './Menu';
import Table from './Table';
import Alert from './Alert';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import Typography from './Typography';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    Menu(theme),
    Input(theme),
    Table(theme),
    Alert(theme),
    Select(theme),
    Button(theme),
    Typography(theme)
  );
}
