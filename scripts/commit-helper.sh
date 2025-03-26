#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to validate input is not empty
validate_input() {
  if [[ -z "$1" ]]; then
    echo -e "${YELLOW}This field is required. Please try again.${NC}"
    return 1
  fi
  return 0
}

# Prefix selection
select_prefix() {
  echo -e "${BLUE}What is the prefix of the task?${NC}"
  select prefix in "feature" "fix" "update" "chore" "refactor"; do
    if [[ -n $prefix ]]; then
      echo -e "${GREEN}Selected prefix: $prefix${NC}"
      return 0
    else
      echo -e "${YELLOW}Invalid selection. Please select a number from the list.${NC}"
    fi
  done
}

# Get feature name
get_feature() {
  while true; do
    echo -e "${BLUE}What was the feature affected by this task?${NC}"
    read feature
    if validate_input "$feature"; then
      break
    fi
  done
  echo -e "${GREEN}Feature: $feature${NC}"
}

# Get task number
get_task_number() {
  while true; do
    echo -e "${BLUE}What is the task number on Jira?${NC}"
    read task_number
    if validate_input "$task_number"; then
      break
    fi
  done
  echo -e "${GREEN}Task number: $task_number${NC}"
}

# Get commit message
get_commit_message() {
  while true; do
    echo -e "${BLUE}Enter the commit message:${NC}"
    read commit_message
    if validate_input "$commit_message"; then
      break
    fi
  done
  echo -e "${GREEN}Commit message: $commit_message${NC}"
}

# Main script execution
echo -e "${GREEN}=== Git Commit Helper ===${NC}"
echo "This script will help you format your git commit message."
echo

# Get all required information
select_prefix
get_feature
get_task_number
get_commit_message

# Format the commit message
formatted_message="[$prefix][$feature][$task_number]: $commit_message"

# Show preview and confirm
echo
echo -e "${BLUE}Your commit message will be:${NC}"
echo -e "${GREEN}$formatted_message${NC}"
echo
echo -e "${BLUE}Proceed with commit? (y/n)${NC}"
read confirm

if [[ $confirm == "y" || $confirm == "Y" ]]; then
  # Execute git commit command
  git commit -m "$formatted_message"
  echo -e "${GREEN}Commit successful!${NC}"
else
  echo -e "${YELLOW}Commit canceled.${NC}"
fi