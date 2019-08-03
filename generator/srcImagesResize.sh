#!/bin/bash
find ../contents/ -name '*.jpg' -execdir mogrify -verbose -resize "1024x1024>" {} \;
