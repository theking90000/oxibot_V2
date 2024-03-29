import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Selector from "./Selector";
import { store } from "../../../app";
import { getPermission, hasPermission } from "../../../../helper/permission";
import { useTranslation } from "react-i18next";
import { update_user_group } from "../../../../reducers/Users";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    card: {
      width: "100%",
    },
    cardContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  })
);

type val = {
  name: string;
  value: any;
};

export default function UserC(props: {
  perms: string[];
  pseudo?: string;
  name: string;
  id: string;
  url: string;
  groups: val[];
  availablegroups: val[];
}) {
  const classes = useStyles();

  const handleChange = async (type: "ADD" | "REMOVE", value: val) => {
    const request = await fetch("/api/user/groups", {
      headers: {
        Authorization: window.localStorage.oxibotV2_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: props.id,
        guild: store.getState().ChangeGuild.guild.id,
        action: type,
        group: value.name,
      }),
      method: "POST",
    });

    const json = await request.json();

    if (json && json.success) {
      store.dispatch(
        update_user_group({
          ServerID: store.getState().ChangeGuild.guild.id,
          group: value.name,
          userID: props.id,
          type: type,
        })
      );
    }
  };

  const __url = props.url ? props.url.replace("size=128", "size=64") : "";

  const [url, setUrl] = React.useState(
    __url.split("?")[0].endsWith(".gif")
      ? __url.replace(".gif", ".webp")
      : __url
  );

  React.useEffect(() => {
    setUrl(
      __url.split("?")[0].endsWith(".gif")
        ? __url.replace(".gif", ".webp")
        : __url
    );
  }, [props.url]);

  const handleEnter = () => {
    setUrl(__url);
  };

  const handleLeave = () => {
    setUrl(
      __url.split("?")[0].endsWith(".gif")
        ? __url.replace(".gif", ".webp")
        : __url
    );
  };

  const { t, i18n } = useTranslation();

  const name = props.pseudo
    ? t("UserFormatListNickName", { tag: props.name, nickname: props.pseudo })
    : t("UserFormatList", { tag: props.name });

  return (
    <ListItem onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div>
            <Avatar alt={props.name} src={url} />
            <Typography>{name}</Typography>
          </div>
          <Selector
            selected={props.groups}
            canAdd={hasPermission("panel.groups.permission.add", props.perms)}
            canRemove={hasPermission(
              "panel.groups.permission.delete",
              props.perms
            )}
            availables={props.availablegroups}
            onChange={handleChange}
          />
        </CardContent>
      </Card>
    </ListItem>
  );
}
