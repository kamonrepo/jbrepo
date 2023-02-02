
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  Paper: {
    display: 'flex',
    backgroundColor: '#dce8e0',
    padding: theme.spacing(6),
    justifyContent:'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  Select: {
    margin: '3px 3px 33px 3px',
    fontFamily: 'Segoe UI'
  },
  createButton: {
    display: 'flex', 
    justifyContent:'flex-end',
    marginBottom: '33px'
  }
}));
