
#!/bin/bash
set -x
echo $KEY >> tosu_node.pem
sudo chmod 600 tosu_node.pem
sudo mv tosu_node.pem  ~/.travis/id_rsa
