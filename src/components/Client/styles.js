
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  Header: {
    display: 'flex',
    margin: '3px 3px 33px 3px',
    fontFamily: 'Segoe UI'
  },
  textFields: {
    marginBottom: '12px'
  },
  Select: {
    display: 'flex',
    margin: '3px 3px 33px 3px',
    fontFamily: 'Segoe UI'
  },
  paper: {
    display: 'flex',
    padding: theme.spacing(6),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },

  buttonSubmit: {
    marginBottom: 10,
  },

}));
