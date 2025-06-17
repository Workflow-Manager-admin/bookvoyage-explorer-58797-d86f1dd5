#!/bin/bash
cd /home/kavia/workspace/code-generation/bookvoyage-explorer-58797-d86f1dd5/bookvoyage_explorer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

