#!/bin/sh

# always patch the version number on update
# TODO: sed out old version number and repo name
git push --no-verify && git push --tags --no-verify
