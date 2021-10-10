import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Box from "@material-ui/core/Box";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { fetch_user_data } from "../../../../reducers/Modules";
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MapStateToProps = (state: any) => {
  const _guild: any = state.Modules.find(
    (x) => x.id === state.ChangeGuild.guild.id
  );
  if (_guild) {
    return { guild: _guild };
  }
};

const MD: React.FC<{ guild?: any; module: string }> = ({ guild, module }) => {
  const [UserData, SetUserData] = React.useState<boolean | any[]>(true);
  const [display, setDisplay] = React.useState<boolean>(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    const mod = guild.modules.find((x) => x.name === module);
    if (mod.userdata) {
      SetUserData(mod.userdata);
    } else {
      fetch_user_data({ guild: guild.id, name: module });
      SetUserData(true);
    }
  }, [guild]);

  const ToggleModal = (v = null) => {
    setDisplay((d) => (v !== null ? v : !d));
  };

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => ToggleModal(true)}>{t("ShowUserData")}</Button>
      </div>
      <Dialog fullScreen open={display} TransitionComponent={Transition}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => ToggleModal(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Typography variant="h6">{""}</Typography>
            </div>
          </div>
        </Toolbar>
        {UserData === true && <CircularProgress />}
        {Array.isArray(UserData) && (
          <List>
            {(UserData as any[]).map((data, key) => (
              <ListItem key={key}>{JSON.stringify(data)}</ListItem>
            ))}
          </List>
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default connect(MapStateToProps)(MD);
