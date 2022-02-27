
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  Header: {
    display: 'flex',
    margin: '3px 3px 3px 3px'

  },
  Select: {
    display: 'flex',
    margin: '3px 3px 3px 3px'
  },
  paper: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',

    flexWrap: 'wrap',

  },

  buttonSubmit: {
    marginBottom: 10,
  },

}));
