import todoist
from todoist.api import TodoistAPI
api = TodoistAPI(token='f3369809dd943cbb49a938a221b0fb311a9af68c')

# Initial sync of your account
api.sync()

# Find Inbox in project - can be adapted to delete completed tasks for other projects as well
projects = api.projects.all()
inbox = next(p for p in projects if 'inbox_project' in p)

# Process tasks until explicitly aborted
while True:
    # Get completed tasks for project, a maximum of 100 tasks is supported per batch
    completed = api.items.get_completed(project_id=inbox['id'], limit=100)
    if not completed:
        break  # No completed tasks left, abort

    # Delete the completed tasks
    for c in completed:
        api.items.delete(c['id'])

    # Commit deletion requests
    api.commit()