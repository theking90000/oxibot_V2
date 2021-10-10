#!/usr/bin/bash

build(){
yarn builddev &
yarn serverdev
}

nodemon_s(){
    yarn dev
}
node_s(){
    node dist/server/
}

selectChoice(){
    clear
    echo "[0] lancer la compilation en watchmode"
    echo "[1] lancer nodemon"
    echo "[2] lancer node"

    read -p ">" selected

    case $selected in
        0)
        build
        ;;
        1)
        nodemon_s
        ;;
        2)
        node_s
        ;;
        *)
        selectChoice
    esac
}
selectChoice


wait
