bind = "0.0.0.0:8000"
workers = 4
threads = 4
timeout = 60
worker_class = "gthread"  # async-ish workloads
accesslog = "-"
errorlog = "-"
loglevel = "info"
