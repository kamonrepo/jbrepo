
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
  },
  Paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
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
  },
  Button: {
    display: 'flex'
  }

}));
