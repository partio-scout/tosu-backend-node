
#!/bin/bash
set -x
echo $DEPLOY_KEY >> tosu_node.pem
eval "$(ssh-agent -s)"
sudo chmod 600 tosu_node.pem
sudo mv tosu_node.pem  ~/.travis/id_rsa
