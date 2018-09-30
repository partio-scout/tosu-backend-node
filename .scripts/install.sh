#!/bin/bash
set -x
openssl aes-256-cbc -K $encrypted_key -iv $encrypted_iv -in tosu_node.pem.enc -out deploy.pem -d
rm tosu_node.pem.enc
sudo chmod 600 deploy.pem
sudo mv deploy.pem ~/.travis/id_rsa