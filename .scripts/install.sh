
#!/bin/bash
set -e
eval $(ssh-agent -s)
echo "$PRIVATE_KEY" | tr -d '\r' | ssh-add - > ~/.travis/id_rsa
