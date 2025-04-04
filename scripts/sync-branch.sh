#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default branch is main
SOURCE_BRANCH=${1:-main}

# Get current branch name
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)

echo -e "${BLUE}=== Git Branch Sync Helper ===${NC}"
echo -e "${BLUE}Source branch: ${GREEN}$SOURCE_BRANCH${NC}"
echo -e "${BLUE}Current branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo

# Confirm with user
echo -e "${YELLOW}This will sync code from '$SOURCE_BRANCH' into your current branch '$CURRENT_BRANCH'.${NC}"
echo -e "${YELLOW}Are you sure you want to continue? (y/n)${NC}"
read -r confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

echo -e "${BLUE}Fetching latest changes...${NC}"
if ! git fetch origin $SOURCE_BRANCH; then
    echo -e "${RED}Failed to fetch from remote. Please check your internet connection and try again.${NC}"
    exit 1
fi

echo -e "${BLUE}Merging changes from $SOURCE_BRANCH...${NC}"
if ! git merge origin/$SOURCE_BRANCH; then
    echo -e "${RED}Merge failed. Please resolve conflicts and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully synced changes from $SOURCE_BRANCH to $CURRENT_BRANCH!${NC}" 