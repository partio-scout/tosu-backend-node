
#!/bin/bash
set -x
openssl enc -nosalt -aes-256-cbc -d -in tosu_node.pem.enc -out tosu_node.pem -base64 -K $encrypted_key -iv $encrypted_iv
rm tosu_node.pem.enc
sudo chmod 600 tosu_node.pem 
sudo mv tosu_node.pem  ~/.travis/id_rsa
