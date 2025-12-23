#!/bin/bash

echo "Starting Factify Services..."

# Get absolute path of the script directory to ensure 'cd' works 
# regardless of where the new shell starts.
# We interpret this path in a way that works for the current shell.
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

run_in_window() {
    local title="$1"
    local dir="$2"
    local cmd="$3"

    echo "Starting $title..."
    
    # Construct the absolute path target
    local target_path="$PROJECT_ROOT/$dir"
    
    # Debug info for the user in the new window
    local debug_cmd="echo 'Targeting: $target_path'; cd \"$target_path\" || { echo 'Failed to cd to $target_path'; read -p 'Hit Enter...'; exit 1; }"
    
    local full_cmd="$debug_cmd; echo 'Starting...'; $cmd; echo; echo 'Process exited.'; read -p 'Press Enter to close...'"

    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Git Bash / MinGW
        start "$title" bash -c "$full_cmd"
    elif [[ -f /proc/version ]] && grep -q "Microsoft" /proc/version; then
        # WSL
        # WSL paths need accessible windows paths if we use cmd start, but if we stay in wsl world:
        # It's tricky. Assuming simple WSL usage:
        cmd.exe /c start "$title" bash -c "$full_cmd"
    else
        # Linux/Mac
        (cd "$target_path" && eval "$cmd") &
    fi
}

# 1. Node.js Backend
run_in_window "Node Backend" "server" "node app.js"
sleep 2

# 2. Python RAG Service
run_in_window "Python RAG" "RAG" "python main.py"
sleep 2

# 3. React Frontend
run_in_window "React Frontend" "client" "npm run dev"

echo
echo "All services launched."
read -p "Press Enter to exit this launcher script..."
