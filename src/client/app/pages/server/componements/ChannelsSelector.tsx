import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { fetch_data } from "../../../../reducers/Channels";
import SelectorC from "./Selector";

function mapStateToProps(state) {
  const channels = state.Channels.find((c) => c.id === state.ChangeGuild.guild.id);
  if (channels) return { channels: channels.channels };
  else fetch_data(state.ChangeGuild.guild.id);

  return { channels: null };
}

type channels = {
  id: string;
  name: string;
  type: string;
};

function Selector(props: {
  onChangeALL?: (data) => void;
  channels?: channels[];
  max?: number;
  min?: number;
  default?: string[];
}) {
  if (!props.channels) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const [selected, setSelected] = React.useState(props.default || []);

  const { t, i18n } = useTranslation();

  const handleChange = (type, data, cancel) => {
    if (type === "ADD") {
      if (props.max && props.max <= selected.length) return cancel(true);
      setSelected((s) => [...s, data.value]);
    }
    if (type === "REMOVE") {
      if (props.min && props.min >= selected.length) return cancel(true);

      setSelected((s) => s.filter((x) => x !== data.value));
    }
    if (props.onChangeALL)
      props.onChangeALL(
        type === "ADD"
          ? [...selected, data.value]
          : selected.filter((x) => x !== data.value)
      );
    cancel(false);
  };

  return (
    <div>
      {t("ChannelSelector")}
      <SelectorC
        availables={props.channels
          .filter((x) => !(props.default && props.default.includes(x.id)))
          .map((role) => ({
            name: role.name,
            value: role.id,
          }))}
        onChangeCancelable={handleChange}
        selected={
          props.default
            ? props.default
                .filter((x) => props.channels.find((c) => c.id === x))
                .map((default_) => {
                  const role = props.channels.find((c) => c.id === default_);
                  return {
                    name: role.name,
                    value: role.id,
                  };
                })
            : []
        }
        canAdd={true}
        canRemove={true}
      />
    </div>
  );
}

export default connect(mapStateToProps)(Selector);
