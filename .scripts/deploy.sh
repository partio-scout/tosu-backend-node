#!/bin/bash
set -x
eval "$(ssh-agent -s)"
ssh-add ~/.travis/id_rsa
ssh ubuntu@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~/tosu-backend-node
        git pull
        npm install
	echo "Frontside ollie ftw!"
    fi
EOF
