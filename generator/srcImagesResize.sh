#!/bin/bash
find ./src/pages/ -name '*.jpg' -execdir mogrify -verbose -resize "1024x1024>" {} \;
