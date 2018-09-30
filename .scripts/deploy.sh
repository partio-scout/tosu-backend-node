#!/bin/bash
set -x
ssh deploy@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~/tosu-backend-node
        git pull
        npm install
	echo "Frontside ollie ftw!"
    fi
EOF
