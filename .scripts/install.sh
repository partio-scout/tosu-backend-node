
#!/bin/bash
set -x
echo $DEPLOY_KEY >> ~/tosu_node.pem
sudo chmod 600 ~/tosu_node.pem