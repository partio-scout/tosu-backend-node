
#!/bin/bash
set -x
eval "$(ssh-agent -s)"
chmod 600 ~/.travis/id_rsa
ssh-add ~/.travis/id_rsa
ssh ubuntu@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~/tosu-backend-node
        git pull
        npm install
        pm2 restart process.json
	echo "Frontside ollie ftw!"
    fi
EOF
