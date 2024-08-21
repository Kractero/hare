{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell
{
  nativeBuildInputs = with pkgs; [
    nodejs
    npm-check-updates
  ];
}
