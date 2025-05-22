# Testing

## Tox commands

```bash
# test everything
tox

# run a single test (run lint, unit test)
tox -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only

# run only the unit test, no lint
tox -e py12 -- backend/ride/tests/test_views.py::test_rides_accessible_to_admin_only

# Tracebacks
# note: the -- separates pytest args from tox args

# --tb=short: compact tracebacks
tox -e py12 -- --tb=short

# --tb=auto: smart formatting
tox -e py12 -- --tb=auto

# --tb=line: one-line tracebacks
tox -e py12 -- --tb=line

# --tb=no: disables tracebacks (only shows error summary)
tox -e py12 -- --tb=no

# -q: quiet output
tox -e py12 -- -q
```
