
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  Header: {
    display: 'flex',
    margin: '3px 3px 3px 3px',
    fontFamily: 'Segoe UI'

  },
  groupListPaper: {
      flexDirection: 'column',
      margin: '3px 3px 3px 3px',
      padding: theme.spacing(1),
  },
  addGroupForm: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  buttonSubmit: {
    marginBottom: 10
  },

}));
