{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz") {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.androidsdk
  ];
  shellHook = ''
    export ANDROID_HOME="${pkgs.androidsdk}/share/android-sdk"
    export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
  '';
}
