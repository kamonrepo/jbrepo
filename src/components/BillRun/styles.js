import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    width: '200%',
    padding: theme.spacing(3)
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  maincon: {
    display: 'flex',
    alignItems: 'center'
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1)
  },
  id: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1)
  },
  submit: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1)
  },

}));
