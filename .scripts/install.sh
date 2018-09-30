
#!/bin/bash
set -x
eval $(ssh-agent -s)
echo "$DEPLOY_KEY" | tr -d '\r' | ssh-add - > ~/.travis/id_rsa
chmod 600 ~/.travis/id_rsa
mkdir -p ~/.ssh
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config