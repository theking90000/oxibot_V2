import * as React from "react";
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
import { Choice, Number, String } from "./ModuleSetting";
import RolesSelector from "./RolesSelector";
import { useTranslation } from "react-i18next";
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { update_data } from "../../../../reducers/Modules";
import DeleteIcon from "@material-ui/icons/Delete";
import ChannelsSelector from "./ChannelsSelector";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      background: theme.palette.background.default,
      padding: "5px",
      width: "100%",
      height: "100px",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    container: {
      maxWidth: "20 %",
    },
  })
);

export default function (props) {
  const [display, setDisplay] = React.useState(false);
  let counter = 1;
  const getCounter = () => {
    counter++;
    return Math.round(
      Date.now() * (counter * (Math.random() + counter) * (Math.random() * 10))
    );
  };
  const [value, setValue] = React.useState(
    props.value?.selected?.map((x, index) => ({ ...x, _id: getCounter() })) ||
      []
  );
  const [Loading, setLoading] = React.useState(false);

  const { t } = useTranslation();

  const ToggleModal = (v = null) => {
    setDisplay((d) => (v !== null ? v : !d));
  };

  const HandleAddValue = () => {
    setValue((v) => [
      ...v,
      {
        ...getElems(props.value.availables),
        _id: getCounter(),
      },
    ]);
  };
  const HandleUpdate = (value) => {
    setValue((v) => {
      const b = v.map((x) => {
        if (x._id === value._id) {
          return value;
        }
        return x;
      });

      return b;
    });
  };
  const Handleremove = (id) => {
    setValue((v) => {
      return v.filter((x) => x._id !== id);
    });
  };

  const saveData = async () => {
    if (Loading) return;
    setLoading(true);

    console.dir(value);

    await update_data({
      guild: props.id,
      path: props.name,
      name: props.module,
      type: props.type,
      value: value.map((v) => {
        let r = {};
        for (const v_ in v) {
          if (v_ === "_id") continue;
          r[v_] = v[v_];
        }
        return r;
      }),
    });

    setLoading(false);
  };

  return (
    <React.Fragment>
      {props.page && (
        <div>
          <Button onClick={() => ToggleModal(true)}>{props.name}</Button>
        </div>
      )}
      {props.page && (
        <div>
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
                  <Typography variant="h6">{props.name}</Typography>
                </div>
                <div>
                  <Button
                    style={{ marginLeft: "auto" }}
                    autoFocus
                    color="inherit"
                    onClick={saveData}
                  >
                    {!Loading && t("Save")}
                    {Loading && <CircularProgress />}
                  </Button>
                </div>
              </div>
            </Toolbar>
            <List>
              {value.map((value, index) => (
                <ListItem key={value._id}>
                  <SettingLine
                    value={...value}
                    availables={props.value.availables}
                    onUpdate={HandleUpdate}
                    onRemove={Handleremove}
                  />
                </ListItem>
              ))}
              <ListItem>
                <Button fullWidth onClick={HandleAddValue}>
                  <AddCircleOutlineIcon />
                </Button>
              </ListItem>
            </List>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
}

function getElems(availables) {
  let selected = {};
  const loop = (selected) => {
    for (const elem in availables) {
      if (selected[elem]) continue;
      const e = availables[elem];
      if (e.meta && e.meta.with_value && e.meta.with_value.name) {
        if (!selected[e.meta.with_value.name]) continue;
        if (
          e.meta.with_value.value &&
          e.meta.with_value.value.selected &&
          selected[e.meta.with_value.name].selected &&
          selected[e.meta.with_value.name].selected !==
            e.meta.with_value.value.selected
        ) {
          continue;
        }

        if (
          e.meta.with_value.value &&
          !e.meta.with_value.value.selected &&
          selected[e.meta.with_value.name] &&
          selected[e.meta.with_value.name] !== e.meta.with_value.value
        ) {
          continue;
        }
      }
      selected[elem] = e.default;
    }
    return selected;
  };
  selected = loop({});
  return selected;
}

function SettingLine(props) {
  const [values, setValues] = React.useState(props.value);

  const styles = useStyles();

  const handleChange = (name, v_) => {
    const a = { ...props.availables };
    for (const value in values) {
      if (value === "_id") continue;
      const v = values[value];
      if (value === name) {
        if (a[value] && a[value].type === "choice") {
          a[value] = { ...a[value], default: { ...a[value].default, ...v_ } };
        } else {
          a[value] = { ...a[value], default: v_ };
        }
        continue;
      }
      a[value] = { ...a[value], default: v };
    }
    const vals = getElems(a);
    setValues({ ...vals, _id: values._id });
    props.onUpdate({ ...vals, _id: values._id });
  };

  const handleDelete = () => {
    if (props.value._id) props.onRemove(props.value._id);
  };

  return (
    <div style={{ width: "100%" }}>
      <Box
        display="flex"
        width="100%"
        justifyContent="space-around"
        flexDirection="row"
        className={styles.bar}
      >
        {values &&
          Object.keys(values)
            .filter((x) => x !== "_id")
            .map((name, index) => {
              const action = props.availables[name];
              return (
                <div className={styles.container} key={index}>
                  <SettingValue
                    onChange={(x) => handleChange(name, x)}
                    name={name}
                    {...action}
                    value={values[name]}
                  />
                </div>
              );
            })}
        <div>
          <Button onClick={handleDelete}>
            <DeleteIcon />
          </Button>
        </div>
      </Box>
    </div>
  );
}

const SettingValue: React.FC<any> = (props) => {
  const handleChange = (value) => {
    props.onChange(value);
  };

  switch (props.type) {
    case "number": {
      return (
        <div>
          <Number {...props} onChange={handleChange} />
        </div>
      );
    }
    case "string": {
      return (
        <div>
          <String {...props} onChange={handleChange} />
        </div>
      );
    }
    case "choice": {
      return (
        <div>
          <Choice {...props} onChange={handleChange} />
        </div>
      );
    }
    case "role": {
      return (
        <div>
          <RolesSelector
            max={props.meta && props.meta.max ? props.meta.max : null}
            min={props.meta && props.meta.min ? props.meta.min : null}
            default={props.value || []}
            onChange={() => null}
            onChangeALL={handleChange}
          />
        </div>
      );
    }
    case "channel": {
      return (
        <div>
          <ChannelsSelector
            max={props.meta && props.meta.max ? props.meta.max : null}
            min={props.meta && props.meta.min ? props.meta.min : null}
            default={props.value || []}
            onChangeALL={handleChange}
          />
        </div>
      );
    }
    default:
      return <div>Error</div>;
  }
};
