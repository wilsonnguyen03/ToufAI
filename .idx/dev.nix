# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "unstable"; # or "stable-24.05"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.androidsdk
  ];

  # Allow unfree packages and accept the Android SDK license
  nixpkgs.config = {
    allowUnfree = true;
    android_sdk.accept_license = true;
  };

  # Sets environment variables in the workspace
  env = {
    ANDROID_HOME = "${pkgs.androidsdk}/share/android-sdk";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        npm-install = "cd ToufAI && npm install";
      };
    };
  };
}
