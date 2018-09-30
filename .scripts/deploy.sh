#!/bin/bash
set -x
eval "$(ssh-agent -s)"
ssh -i ~/.travis/id_rsa/tosu_node.pem ubuntu@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~/tosu-backend-node
        git pull
        npm install
	echo "Frontside ollie ftw!"
    fi
EOF
