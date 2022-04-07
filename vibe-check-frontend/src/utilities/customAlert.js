import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";

/**
 * This Component is a Small Alert used to show a custom alert message to user with 
 * an option to close alert
 */

export default function CustomAlert({
  alertText,
  alertOpen,
  setAlertClose,
  severityRating,
}) {
  return (
    <Collapse in={alertOpen}>
      <Alert
        severity={severityRating != null ? severityRating : "warning"}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setAlertClose();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {alertText}
      </Alert>
    </Collapse>
  );
}


/* References: 
 Material UI Demos for Ref: 
 Alert Component (used in CustomAlert): https://material-ui.com/components/alert/
*/
