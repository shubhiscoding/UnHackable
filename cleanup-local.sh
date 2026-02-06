#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="demo"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   UnHackable - Local Cleanup Script${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Cleaning up namespace '$NAMESPACE'...${NC}\n"

kubectl delete namespace $NAMESPACE 2>/dev/null && {
    echo -e "${GREEN}✓ Namespace '$NAMESPACE' deleted successfully${NC}"
} || {
    echo -e "${YELLOW}⚠ Namespace '$NAMESPACE' not found or already deleted${NC}"
}

echo -e "\n${GREEN}✓ Cleanup complete!${NC}\n"
