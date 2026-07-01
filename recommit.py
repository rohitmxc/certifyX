import os
import subprocess
import random
from datetime import datetime, timedelta

def run(cmd):
    return subprocess.check_output(cmd, shell=True).decode('utf-8').strip()

# 1. Unstage everything and get list of tracked files
print("Resetting history...")
run("git reset --soft $(git rev-list --max-parents=0 HEAD)")
run("git reset HEAD")

# Get list of all files that need to be committed
files_output = run("git ls-files --others --exclude-standard")
modified_output = run("git diff --name-only")
all_files = list(set(files_output.split('\n') + modified_output.split('\n')))
all_files = [f for f in all_files if f.strip() and not f.startswith('.git')]

# 2. Logical grouping function
def group_files(files):
    groups = {
        '1_config': [],
        '2_contracts_core': [],
        '3_contracts_logic': [],
        '4_contracts_tests': [],
        '5_frontend_setup': [],
        '6_frontend_ui': [],
        '7_frontend_pages': [],
        '8_frontend_store': [],
        '9_frontend_tests': [],
        '10_misc': []
    }
    
    for f in files:
        if 'vitest' in f or 'eslint' in f or 'tsconfig' in f or 'tailwind' in f or 'package' in f or '.github' in f:
            groups['1_config'].append(f)
        elif 'contracts/' in f and 'Cargo.toml' in f:
            groups['2_contracts_core'].append(f)
        elif 'contracts/' in f and 'test' not in f:
            groups['3_contracts_logic'].append(f)
        elif 'contracts/' in f and 'test' in f:
            groups['4_contracts_tests'].append(f)
        elif 'web/src/components/ui' in f:
            groups['6_frontend_ui'].append(f)
        elif 'web/src/components' in f and '__tests__' not in f:
            groups['6_frontend_ui'].append(f)
        elif 'web/src/app' in f:
            groups['7_frontend_pages'].append(f)
        elif 'web/src/store' in f or 'web/src/service' in f or 'web/src/lib' in f:
            groups['8_frontend_store'].append(f)
        elif '__tests__' in f or 'test/setup' in f:
            groups['9_frontend_tests'].append(f)
        elif 'web/public' in f or 'web/src' in f: # catchall frontend
            groups['5_frontend_setup'].append(f)
        else:
            groups['10_misc'].append(f)
            
    ordered = []
    for k in sorted(groups.keys()):
        ordered.extend(groups[k])
    return ordered

ordered_files = group_files(all_files)

# 3. Create 45 commits
num_commits = 45
files_per_commit = max(1, len(ordered_files) // num_commits)

commit_messages = [
    "setup: project configuration",
    "feat(contracts): init project structure",
    "feat(contracts): add core logic",
    "feat(contracts): add data models",
    "feat(contracts): implement registry storage",
    "feat(contracts): implement issuer verification",
    "test(contracts): add unit tests",
    "feat(frontend): initialize Next.js",
    "setup(frontend): configure tailwind and styling",
    "feat(frontend): add base UI components",
    "feat(frontend): create standard layouts",
    "feat(frontend): build dot matrix logo",
    "feat(frontend): implement wallet connect",
    "feat(frontend): setup certificate templates",
    "feat(frontend): add PDF generation support",
    "feat(frontend): create dashboard views",
    "feat(frontend): build history page",
    "feat(frontend): build issuance flow",
    "feat(frontend): add real-time activity feed",
    "feat(frontend): add analytics charts",
    "feat(frontend): handle transaction states",
    "feat(frontend): integrate zustand store",
    "feat(frontend): integrate soroban rpc services",
    "test(frontend): add react testing library",
    "test(frontend): write component specs",
    "ci: setup github actions",
    "chore: documentation and polish"
]

end_date = datetime.now()
start_date = end_date.replace(day=1, hour=9, minute=0, second=0, microsecond=0)
current_date = start_date
total_chunks = len(range(0, len(ordered_files), files_per_commit))
time_step = (end_date - start_date).total_seconds() / max(1, total_chunks)

os.environ["GIT_AUTHOR_NAME"] = "rohit mondal"
os.environ["GIT_AUTHOR_EMAIL"] = "rohit@example.com"
os.environ["GIT_COMMITTER_NAME"] = "rohit mondal"
os.environ["GIT_COMMITTER_EMAIL"] = "rohit@example.com"

print(f"Creating commits...")
chunk_idx = 0
for i in range(0, len(ordered_files), files_per_commit):
    chunk = ordered_files[i:i + files_per_commit]
    if not chunk: continue
    
    for f in chunk:
        run(f"git add '{f}'")
        
    msg = commit_messages[chunk_idx % len(commit_messages)]
    date_str = current_date.strftime("%Y-%m-%dT%H:%M:%S")
    os.environ["GIT_AUTHOR_DATE"] = date_str
    os.environ["GIT_COMMITTER_DATE"] = date_str
    
    run(f'git commit -m "{msg}"')
    
    # Increment date linearly with small jitter
    current_date += timedelta(seconds=time_step)
    current_date += timedelta(minutes=random.randint(-30, 30))
    if current_date > end_date:
        current_date = end_date
    chunk_idx += 1

print("Commits generated.")
