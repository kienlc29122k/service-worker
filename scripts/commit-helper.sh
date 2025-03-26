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

# Prefix selection with arrow key navigation
select_prefix() {
  echo -e "${BLUE}What is the prefix of the task? (Use ↑/↓ arrows and press Enter)${NC}"
  
  # Define options
  options=("feature" "fix" "update" "chore" "refactor")
  
  # Initialize selection index
  selected=0
  
  # Draw the menu
  draw_menu() {
    # Move cursor up by number of options + 1 (for the prompt)
    for ((i=0; i<=${#options[@]}; i++)); do
      tput cuu1 2>/dev/null
    done
    
    # Clear lines and redraw
    echo -e "${BLUE}What is the prefix of the task? (Use ↑/↓ arrows and press Enter)${NC}"
    for i in "${!options[@]}"; do
      if [[ $i -eq $selected ]]; then
        echo -e " > ${GREEN}${options[$i]}${NC}"
      else
        echo -e "   ${options[$i]}"
      fi
    done
  }
  
  # Draw initial menu
  for i in "${!options[@]}"; do
    if [[ $i -eq $selected ]]; then
      echo -e " > ${GREEN}${options[$i]}${NC}"
    else
      echo -e "   ${options[$i]}"
    fi
  done
  
  # Handle key presses
  while true; do
    read -rsn1 key
    
    if [[ $key == $'\x1b' ]]; then
      read -rsn2 key
      
      case "$key" in
        '[A') # Up arrow
          ((selected--))
          if [[ $selected -lt 0 ]]; then
            selected=$((${#options[@]}-1))
          fi
          draw_menu
          ;;
        '[B') # Down arrow
          ((selected++))
          if [[ $selected -ge ${#options[@]} ]]; then
            selected=0
          fi
          draw_menu
          ;;
      esac
    elif [[ $key == "" ]]; then # Enter key
      prefix=${options[$selected]}
      echo
      echo -e "${GREEN}Selected prefix: $prefix${NC}"
      return 0
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