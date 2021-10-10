import { Grid, Grow, Switch } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { replace } from "connected-react-router";
import Box from "@material-ui/core/Box";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { store } from "../../app";
import CommandSettingValue from "./componements/CommandSettingValue";
import { SetCommandEnabled } from "../../../reducers/Commands";
import { fetch_data, SetModuleEnabled } from "../../../reducers/Modules";
import CircularProgress from "@material-ui/core/CircularProgress";
import CommandAliasesSelector from "./componements/CommandAliasesSelector";
import ModuleSetting from "./componements/ModuleSetting";
import ModulesData from "./componements/ModulesData";

const handleData = (store) => {
  return (
    store.Modules.find((c) => c.id === store.ChangeGuild.guild.id) || {
      noGuild: true,
    }
  );
};

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    Grid: {
      background: theme.palette.background.paper,
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      border: theme.spacing(1),
    },
    list: {
      width: "100%",
    },
    field: {
      margin: theme.spacing(2),
    },
    paper: {
      width: "100%",
      height: "100%",
      background: theme.palette.background.default,
      padding: theme.spacing(2),
    },
    parent_box: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    box: {
      width: "50%",
    },
  })
);

const EditModule = (props: any) => {
  if (
    props.noGuild ||
    !props.modules.find((x) => x.name === props.module_name)
  ) {
    fetch_data({ guild: props.id, name: props.module_name });
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const { t, i18n } = useTranslation();
  const classes = useStyle();

  const [c, sc] = React.useState(0);

  let module;

  module = props.modules.find((c) => c.name === props.module_name);

  if (!module) {
    store.dispatch(replace("/guild/" + props.id));
    return null;
  }

  const [enabled, setEnabled] = React.useState(module.toggled);

  const [fade, setFade] = React.useState(false);

  React.useEffect(() => {
    setFade(true);

    return () => setFade(false);
  }, []);

  React.useEffect(() => {
    module = props.modules.find((c) => c.name === props.module_name);

    if (!module) {
      store.dispatch(replace("/guild/" + props.id));
      return null;
    }
  }, [props.modules]);

  const HandleDisable = async () => {
    const payload = await SetModuleEnabled({
      ServerID: props.id,
      name: module.name,
      value: !enabled,
    });
    store.dispatch(payload);
    setEnabled(!enabled);
  };
  return (
    <div>
      <Grow in={fade}>
        <div>
          <Typography variant="h2">
            {t(`ModuleName`, { module: module.name })}
          </Typography>
          <Grid container>
            <Grid item xs={12} className={classes.Grid}>
              <Typography variant="h3">
                {t("EnableModule", { module: module.name })}
              </Typography>
              <Switch
                checked={enabled}
                onChange={HandleDisable}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} className={classes.Grid}>
              <Typography variant="h3">
                {t(`CommandSetting`, { cmd: module.name })}
              </Typography>
              <Grid container className={classes.parent_box}>
                {Object.keys(module.data).map((value, index) => {
                  const d = module.data[value];
                  return (
                    <Box key={index} className={classes.box}>
                      <ModuleSetting
                        type={d.type}
                        value={d.value}
                        name={value}
                        id={props.id}
                        module={module.name}
                        meta={d.meta ? d.meta : null}
                      />
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.Grid}>
              <Typography variant="h3">
                {t("UserDataModule", { module: module.name })}
              </Typography>
              <ModulesData module={module.name} />
            </Grid>
          </Grid>
        </div>
      </Grow>
    </div>
  );
};

export default connect(handleData)(EditModule);
